// insert this component in the client component to trigger the loading UI
export default function SuspenseTrigger() {
  // this triggers Suspense
  throw new Promise(() => {});
}
