import MaterialDetails from "./material-details";

export default async function Material({ params }: { params: { id: string } }) {
  const { id } = params;
  return <MaterialDetails materialId={id} />;
}
