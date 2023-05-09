"use client";
import TIMELINE from "@/data/timeline";
import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
export default function Home() {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [initialDate, setInitialDate] = useState(dayjs());
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    let audio = new Audio(TIMELINE[0].audio!);
    setAudio(audio);

    const handle = () => {
      setNow(dayjs());
      console.log(initialDate.toISOString());
    };
    const interval = setInterval(handle, 500);

    return () => clearInterval(interval);
  }, [initialDate]);

  return (
    <main className="container mx-auto px-4 lg:px-10 py-4 lg:py-10 h-screen flex flex-col">
      <div>
        <h1
          className="text-3xl mb-1.5"
          style={{
            wordBreak: "keep-all",
          }}
        >
          대학수학능력시험 시뮬레이터
        </h1>
        <div className="text-gray-500 font-light text-sm">
          CSAT SIMULATOR 2024
        </div>
      </div>
      <hr className="border-gray-300 border-[0.5px] my-4" />
      <div className="text-center my-auto select-none">
        <div className="text-6xl lg:text-8xl pb-5">
          {dayjs()
            .startOf("day")
            .set("hour", 8)
            .set("minute", 5)
            .set("second", 0)
            .add(now.diff(initialDate), "millisecond")
            .format("HH:mm:ss")}
        </div>
        <div className="text-2xl font-medium">1교시 국어 본령</div>
      </div>

      <div
        className="bg-emerald-400 h-1.5 mb-0.5 rounded-sm"
        style={{
          width: `${(now.diff(initialDate, "seconds") / 30720) * 100}%`,
        }}
      />
      <div className="w-full flex gap-[1px] lg:gap-[4px]">
        {TIMELINE.map((one, i) => {
          return (
            <div
              key={i}
              className="relative"
              style={{
                width: `${(one.duration / 512) * 100}%`,
              }}
            >
              <div className="absolute bottom-[4.5rem] w-20 text-[5px] font-medium lg:text-base">
                {{
                  "0810": "국어",
                  "1015": "수학",
                  "1255": "영어",
                  "1435": "한국사",
                  "1525": "1선택",
                  "1602": "2선택",
                }[one.time] || ""}
              </div>
              <div className="bg-slate-300 h-1.5 mt-auto rounded-sm mb-1" />
              <div
                className={classNames(
                  "text-[5px] text-gray-600 w-[5px] tracking-tight leading-tight",
                  ["준비령", "입실준비", "예비령", "10분전", "5분전"].includes(
                    one.short
                  )
                    ? "hidden lg:block"
                    : ""
                )}
              >
                {one.short}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
