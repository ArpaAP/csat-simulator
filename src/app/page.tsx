"use client";
import TIMELINE from "@/data/timeline";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import {
  TbPlayerPlay,
  TbPlayerPause,
  TbArrowsMoveHorizontal,
} from "react-icons/tb";

export default function Home() {
  const [audio] = useState<HTMLAudioElement>(new Audio());
  const [seconds, setSeconds] = useState(0);
  const [doneTimes, setDoneTimes] = useState<Set<string>>(new Set());
  const [currentTimename, setCurrentTimename] = useState(
    TIMELINE[0].description
  );
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      let interval = setInterval(() => {
        setSeconds((prev) => {
          let current = dayjs()
            .startOf("day")
            .set("hour", 8)
            .set("minute", 5)
            .set("second", 0)
            .add(seconds, "seconds");

          let currentHourMin = current.format("HHmm");

          let newDoneTimes = new Set(doneTimes);

          let newCurrentTimename = "";

          TIMELINE.forEach((one) => {
            let oneHours = Number(one.time.substring(0, 2));
            let oneMinutes = Number(one.time.substring(2, 4));

            let oneTotalSeconds = oneHours * 60 * 60 + oneMinutes * 60 - 29100;

            if (oneTotalSeconds < seconds) {
              newDoneTimes.add(one.time);
              newCurrentTimename = one.description;
            }
          });

          if (!newDoneTimes.has(currentHourMin)) {
            let source = TIMELINE.find(
              (one) => one.time === currentHourMin && current.second() === 0
            );

            if (source?.audio) {
              audio.pause();
              audio.src = source.audio;
              audio.play();

              newDoneTimes.add(current.format("HHmm"));

              setDoneTimes(newDoneTimes);

              newCurrentTimename = source.description;
            }
          }

          setCurrentTimename(newCurrentTimename);

          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [active, audio, doneTimes, seconds]);

  let current = dayjs()
    .startOf("day")
    .set("hour", 8)
    .set("minute", 5)
    .set("second", 0)
    .add(seconds, "seconds");

  return (
    <main className="container mx-auto px-4 xl:px-10 py-4 lg:py-10 h-screen flex flex-col">
      <div className="flex">
        <div className="mr-auto">
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
        <button
          type="button"
          className="hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
        >
          설정...
        </button>
      </div>
      <hr className="border-gray-300 border-[0.5px] my-4" />
      <div className="text-center my-auto select-none">
        <div className="text-6xl lg:text-8xl pb-5">
          {current.format("HH:mm:ss")}
        </div>
        <div className="text-2xl font-medium">{currentTimename}</div>

        <div className="my-5 pt-5 flex gap-3 justify-center w-full">
          {active ? (
            <button
              type="button"
              className="flex gap-2 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
              onClick={() => {
                setActive(false);
                audio.pause();
              }}
            >
              <TbPlayerPause className="my-auto" size={18} /> 중지
            </button>
          ) : (
            <button
              type="button"
              className="flex gap-2 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
              onClick={() => {
                setActive(true);
                if (!audio.ended) {
                  audio.play();
                }
              }}
            >
              <TbPlayerPlay className="my-auto" size={18} /> 시작
            </button>
          )}

          <button
            type="button"
            className="flex gap-2 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
            onClick={() => {
              let hour = Number(prompt("이동할 시"));
              let minute = Number(prompt("이동할 분"));

              let newSeconds = hour * 60 * 60 + minute * 60 - 29100;

              if (isNaN(hour) || isNaN(minute)) {
                return alert("숫자만 입력하십시오.");
              }

              if (newSeconds < 0) {
                return alert("08시 05분 이후의 시간을 입력하십시오.");
              }

              audio.pause();
              audio.src = "";
              setSeconds(newSeconds);
              setDoneTimes(new Set());
            }}
          >
            <TbArrowsMoveHorizontal className="my-auto" size={18} /> 이동
          </button>
        </div>
      </div>

      <div
        className="bg-emerald-400 h-1.5 mb-0.5 rounded-sm"
        style={{
          width: `${(seconds / 30720) * 100}%`,
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
