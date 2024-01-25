export default function Stat(props: {
  name: string;
  value: string;
  className?: string;
}) {
  const { name, value, className } = props;
  return (
    <div className={className}>
      <h3 className="text-md md:text-lg text-foreground/70 font-medium">
        {name}
      </h3>
      <h1 className="text-md md:text-lg font-semibold">{value}</h1>
    </div>
  );
}
