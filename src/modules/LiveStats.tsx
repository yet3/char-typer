import { useAppStore } from "@stores/root.store";

export const LiveStats = () => {
  const cps = useAppStore((s) => s.liveStats.cps);

  return (
    <ul className="flex space-x-3 items-center">
      <li>{((cps * 60) / 5).toFixed()} wpm</li>
      <Divider />
      <li>{(cps * 60).toFixed()} cpm</li>
      <Divider />
      <li>{cps.toFixed()} cps</li>
    </ul>
  );
};

const Divider = () => {
  return <div className="size-2 rounded-full bg-content-primary" />;
};
