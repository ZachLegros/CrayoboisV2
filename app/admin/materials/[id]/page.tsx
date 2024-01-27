import MaterialDetails from "./material-details";
import MaterialHeader from "./material-header";

export default async function Material({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <MaterialHeader />
      <MaterialDetails materialId={id} />
    </div>
  );
}
