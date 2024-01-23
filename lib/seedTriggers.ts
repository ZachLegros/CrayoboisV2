import postgres from "postgres";

const dbUrl = process.env.DIRECT_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

console.log(`Adding triggers and functions to ${process.env.PROJECT_ID}...`);

async function createUserTriggers() {
  await sql`
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      update auth.users set raw_user_meta_data = '{"role":"user"}' where id = new.id;
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
}

async function deleteUserTriggers() {
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
}

async function productAvailabilityTriggers() {
  await sql`
    create or replace function check_product_availability()
    returns trigger as $$
    declare
      available_quantity integer;
    begin
      select quantity into available_quantity from "product" p1
      where p1.id = NEW."productId";
      if NEW.quantity > available_quantity then
        raise exception 'Checkout session violates product quantity constraint';
      else
        return NEW;
      end if;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger check_product_availability_trigger
      before update or insert on "cartItem"
      for each row
      execute function check_product_availability();
  `;
}

async function productQuantityTriggers() {
  await sql`
    create or replace function decrement_product_quantity_in_checkout()
    returns trigger as $$
      begin
        update "product" p1 set quantity = p1.quantity - NEW.quantity
        where p1.id = NEW."productId";
        return NEW;
      end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger decrement_product_quantity_in_checkout_trigger
      after update or insert on "cartItem"
      for each row
      execute function decrement_product_quantity_in_checkout();
  `;

  await sql`
    create or replace function increment_product_quantity_in_checkout()
    returns trigger as $$
      begin
        update "product" p1
        set quantity = p1.quantity + x.item_quantity
        from (
          select item.quantity as item_quantity, p1.id as product_id
          from "cartItem" item join "product" p1 on item."productId" = p1.id
          where "checkoutSessionId" = OLD.id
        ) as x
        where p1.id = x.product_id;
        return OLD;
      end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger increment_product_quantity_in_checkout_trigger
      before delete on "checkoutSession"
      for each row
      execute function increment_product_quantity_in_checkout();
  `;
}

async function productDeleteTriggers() {
  await sql`
    create or replace function prevent_product_delete_in_checkout()
    returns trigger as $$
    begin
      if exists (
        select "productId" from "cartItem" where "cartItem"."productId" = OLD.id
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
      before delete on "product"
      for each row
      execute function prevent_product_delete_in_checkout();
  `;
}

async function deleteCustomProductTriggers() {
  await sql`
    create or replace function delete_custom_product()
    returns trigger as $$
    begin
      delete from "customProduct" where id = OLD."customProductId";
      return NEW;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger delete_custom_product_trigger
      after delete on "cartCustomItem"
      for each row
      execute function delete_custom_product();
  `;
}

async function preventDeleteCompletedCheckoutSessions() {
  await sql`
    create or replace function prevent_delete_completed_checkout_sessions()
    returns trigger as $$
    begin
      if (OLD.status = 'completed') then
        raise exception 'Cannot delete completed checkout session';
      end if;
      return OLD;
    end;
    $$ language plpgsql;
  `;

  await sql`
    create or replace trigger prevent_delete_completed_checkout_sessions_trigger
      before delete on "checkoutSession"
      for each row
      execute function prevent_delete_completed_checkout_sessions();
  `;
}

async function main() {
  await createUserTriggers();
  await deleteUserTriggers();
  await productAvailabilityTriggers();
  await productQuantityTriggers();
  await productDeleteTriggers();
  await deleteCustomProductTriggers();
  await preventDeleteCompletedCheckoutSessions();

  console.log("Finished adding triggers and functions.");
  process.exit();
}

main();
