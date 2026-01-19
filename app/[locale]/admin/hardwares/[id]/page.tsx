import HardwareDetails from "./hardware-details";

export default async function Hardware({ params }: { params: { id: string } }) {
  const { id } = params;
  return <HardwareDetails hardwareId={id} />;
}
