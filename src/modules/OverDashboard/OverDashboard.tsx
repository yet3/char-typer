import { useAppStore } from "@stores/root.store";
import type { ReactNode } from "react";
import { useShallow } from "zustand/shallow";

export const OverDashboard = () => {
  const { durationMs, stats, averageCps, finalAccuracy } = useAppStore(
    useShallow((s) => ({
      averageCps:
        s.run.stats.cpsList.reduce((acc, cur) => acc + cur, 0) /
        s.run.stats.cpsList.length,
      durationMs:
        s.run.finishedAt && s.run.startedAt
          ? (s.run.finishedAt || 0) - (s.run.startedAt || 0)
          : 0,
      stats: s.run.stats,
      finalAccuracy: (() => {
        let errorsCount = 0;
        let totalChars = 0;
        for (const seg of s.run.segments) {
          totalChars += seg.value.length;
          for (let i = 0; i < seg.value.length; i++) {
            const char = seg.value[i];
            const expectedChar = seg.expected[i];

            if (char !== expectedChar) errorsCount++;
          }
        }

        return `${((1 - errorsCount / totalChars) * 100).toFixed(2)}%`;
      })(),
    })),
  );

  const averageCpm = averageCps * 60;
  const averageWpm = (averageCps * 60) / 5;

  const mins = Math.floor(durationMs / 60000);
  const seconds = Math.floor(durationMs / 1000) - mins * 60;
  return (
    <div className="animate-fade-in fill-mode-forwards opacity-0 absolute w-full h-full backdrop-blur-xl z-10 flex justify-center items-center">
      <div className="flex space-x-8">
        <div className="flex flex-col space-y-2">
          <Info name="AVERAGE WPM" value={averageWpm.toFixed()} />
          <Info name="AVERAGE CPM" value={averageCpm.toFixed()} />
          <Info name="AVERAGE CPS" value={averageCps.toFixed()} />
        </div>
        <div className="flex flex-col space-y-2">
          <Info name="FINAL ACCURACY" value={finalAccuracy} />
          <Info name="TYPED CHARS" value={stats.typedCharsCount} />
          <Info name="ERRORS" value={stats.errorsCount} />
        </div>
        <div className="flex flex-col space-y-2">
          <Info
            name="REAL ACCURACY"
            value={`${((1 - stats.errorsCount / stats.typedCharsCount) * 100).toFixed(2)}%`}
          />
          <Info name="RUN DURATION" value={`${mins}m ${seconds}s`} />
        </div>
      </div>
    </div>
  );
};

interface IInfoProps {
  name: string;
  value: ReactNode;
}

const Info = ({ name, value }: IInfoProps) => {
  return (
    <div className="grid items-start text-lg">
      <strong className="uppercase text-content-accent text-base">
        {name}
      </strong>
      {value}
    </div>
  );
};
