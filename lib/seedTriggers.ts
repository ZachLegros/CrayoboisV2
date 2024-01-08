import postgres from "postgres";

const dbUrl = process.env.DIRECT_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

console.log(`Adding triggers and functions to ${process.env.PROJECT_ID}...`);

async function main() {
  await sql`
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profile (id, email)
      values (new.id, new.email);
      return new;
    end;
    $$ language plpgsql security definer;
  `;

  await sql`
    create or replace trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  `;

  await sql`
    create or replace function public.handle_user_delete()
    returns trigger as $$
    begin
      delete from auth.users where id = old.id;
      return old;
    end;
    $$ language plpgsql security definer;
  `;

  await sql`
    create or replace trigger on_profile_user_deleted
      after delete on public.profile
      for each row execute procedure public.handle_user_delete()
  `;

  await sql`
    create or replace function prevent_duplicate_products()
    returns trigger as $$
    begin
      if exists (
        (select "A", "B", quantity from "_CheckoutSessionToProduct" cs
        join product p1 on p1.id = cs."B"
        where "A" <> NEW.id
        and quantity <= 1)
      ) then
        raise exception 'Checkout session violates product quantity constraint';
      else
        return NEW;
      end if;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger prevent_duplicate_products_trigger
      after update or insert on "checkoutSession"
      for each row
      execute function prevent_duplicate_products();
  `;

  await sql`
    create or replace function prevent_product_update_in_checkout()
    returns trigger as $$
    begin
      if exists (
        (select "A", "B" from "_CheckoutSessionToProduct" cs
        where "B" = NEW.id)
      ) then
        raise exception 'Cannot update product in checkout session';
      else
        return NEW;
      end if;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger prevent_product_update_in_checkout_trigger
      after update on "product"
      for each row
      execute function prevent_product_update_in_checkout();
  `;

  await sql`
    create or replace function prevent_product_delete_in_checkout()
    returns trigger as $$
    begin
      if exists (
        (select "A", "B" from "_CheckoutSessionToProduct" cs
        where "B" = OLD.id)
        ) then
        raise exception 'Cannot delete product in checkout session';
      else
        return OLD;
      end if;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger prevent_product_delete_in_checkout_trigger
      after delete on "product"
      for each row
      execute function prevent_product_delete_in_checkout();
  `;

  await sql`
    create or replace function calculate_total_price_of_custom_product()
    returns trigger as $$
    declare
      cp_price numeric;
    begin
      select sum(mat.price) + sum(hw.price) into cp_price from 
      "customProduct" cp join "material" mat on cp.material_id = mat.id join "hardware" hw on cp.hardware_id = hw.id
      where cp.id = NEW.id;
      NEW.price := cp_price;
      return NEW;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger calculate_total_price_of_custom_product_trigger
      before insert or update on "customProduct"
      for each row
      execute function calculate_total_price_of_custom_product();
  `;

  console.log("Finished adding triggers and functions.");
  process.exit();
}

main();
