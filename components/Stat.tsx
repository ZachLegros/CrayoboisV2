export default function Stat(props: { name: string; value: string }) {
  const { name, value } = props;
  return (
    <div>
      <h3 className="text-md md:text-lg text-foreground/70 font-medium">{name}</h3>
      <h1 className="text-md md:text-lg font-semibold mb-2">{value}</h1>
    </div>
  );
}
