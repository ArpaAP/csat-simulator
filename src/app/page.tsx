"use client";
import TIMELINE from "@/data/timeline";
import CLOCKTYPE from "@/data/clocktype";
import { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import {
  TbPlayerPlay,
  TbPlayerPause,
  TbArrowsMoveHorizontal,
  TbClock,
  TbId,
} from "react-icons/tb";
import { Dialog, Transition } from "@headlessui/react";
import Clock from "react-clock";
import { info } from "console";

export default function Home() {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [useEffector, setUseEffector] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [doneTimes, setDoneTimes] = useState<Set<string>>(new Set());
  const [currentTimename, setCurrentTimename] = useState(
    TIMELINE[0].description
  );
  const [active, setActive] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [clockType, setClockType] = useState(CLOCKTYPE.DIGITAL)

  useEffect(() => {
    let audio = new Audio();
    let audioContext = new AudioContext();

    const sourceNode = audioContext.createMediaElementSource(audio);

    const reverbMix = 0.8; // wet / dry
    const reverbTime = 0.25; // 리버브 지속시간
    const reverbDecay = 0.1; // 리버브 감쇠 빠르기

    const delayMix = 0.7;
    const delayFeedback = 0.6;
    const delayTime = 0.001;

    const inputNode = audioContext.createGain();
    const reverbWetGainNode = audioContext.createGain();
    const reverbDryGainNode = audioContext.createGain();
    const reverbNode = audioContext.createConvolver();

    const delayWetGainNode = audioContext.createGain();
    const delayDryGainNode = audioContext.createGain();
    const delayFeedbackNode = audioContext.createGain();
    const delayNode = audioContext.createDelay(delayTime);

    const outputNode = audioContext.createGain();

    sourceNode.connect(inputNode);

    // DELAY //

    // Dry 소스 노드 연결
    inputNode.connect(delayDryGainNode);
    delayDryGainNode.connect(outputNode);
    delayDryGainNode.gain.value = 1 - delayMix;

    // Delay 루프 생성
    delayNode.connect(delayFeedbackNode);
    delayFeedbackNode.connect(delayNode);
    delayFeedbackNode.gain.value = delayFeedback;

    // Wet 소스 노드 연결
    inputNode.connect(delayNode);
    delayNode.connect(delayWetGainNode);
    delayWetGainNode.connect(outputNode);
    delayWetGainNode.gain.value = delayMix;

    // REVERB //

    // Dry 소스 노드 연결
    delayWetGainNode.connect(reverbDryGainNode);
    reverbDryGainNode.connect(outputNode);
    reverbDryGainNode.gain.value = 1 - reverbMix;

    // IR을 생성하여 Convolver의 오디오 버퍼에 입력해준다.
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * reverbTime;
    const impulse = audioContext.createBuffer(2, length, sampleRate);

    const leftImpulse = impulse.getChannelData(0);
    const rightImpulse = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      leftImpulse[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, reverbDecay);
      rightImpulse[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, reverbDecay);
    }

    reverbNode.buffer = impulse;

    // Wet 소스 노드 연결
    delayWetGainNode.connect(reverbNode);
    reverbNode.connect(reverbWetGainNode);
    reverbWetGainNode.connect(outputNode);
    reverbWetGainNode.gain.value = reverbMix;

    // COMPRESSOR //

    const threshold = -12;
    const attack = 0.003;
    const release = 0.25;
    const ratio = 12;
    const knee = 30;

    const compressorNode = audioContext.createDynamicsCompressor();
    compressorNode.threshold.setValueAtTime(
      threshold,
      audioContext.currentTime
    );
    compressorNode.attack.setValueAtTime(attack, audioContext.currentTime);
    compressorNode.release.setValueAtTime(release, audioContext.currentTime);
    compressorNode.ratio.setValueAtTime(ratio, audioContext.currentTime);
    compressorNode.knee.setValueAtTime(knee, audioContext.currentTime);

    reverbWetGainNode.connect(compressorNode);

    compressorNode.connect(outputNode);

    outputNode.connect(audioContext.destination);

    setAudio(audio);
    setAudioContext(audioContext);
  }, []);

  useEffect(() => {
    if (active) {
      let timer = setInterval(() => {
        setSeconds((prev) => {
          return prev + 1;
        });
      }, 1000);

      let interval = setInterval(() => {
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
            audio!.pause();
            audio!.src = source.audio;
            audioContext?.resume();
            audio!.play();

            newDoneTimes.add(current.format("HHmm"));

            setDoneTimes(newDoneTimes);

            newCurrentTimename = source.description;
          }
        }

        setCurrentTimename(newCurrentTimename);
      }, 100);

      return () => {
        clearInterval(timer);
        clearInterval(interval);
      };
    }
  }, [active, audio, audioContext, doneTimes, seconds]);

  let current = dayjs()
    .startOf("day")
    .set("hour", 8)
    .set("minute", 5)
    .set("second", 0)
    .add(seconds, "seconds");

  return (
    <main className="container mx-auto px-4 py-4 lg:py-10 h-screen flex flex-col">
      <div className="flex">
        <div className="mr-auto">
          <h1
            className="text-xl lg:text-3xl mb-1.5"
            style={{
              wordBreak: "keep-all",
            }}
          >
            대학수학능력시험 시뮬레이터
          </h1>
          <div className="text-gray-500 font-light text-xs lg:text-sm">
            CSAT SIMULATOR 2024
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
          onClick={() => setInfoOpen(true)}
        >
          제작자 및 정보
        </button>
      </div>
      <hr className="border-gray-300 border-[0.5px] my-4" />
      <div className="text-center my-auto select-none">
          {clockType === CLOCKTYPE.DIGITAL ?
            <div className="text-6xl lg:text-8xl pb-5">
              {current.format("HH:mm:ss")}
            </div>
            :
            <div className="my-auto mx-auto w-[150px] min-[375px]:w-[250px] md:w-[400px] pb-5">
              <Clock
                className={"m-auto"}
                value={current.toISOString()}
                locale={"ko-KR"}
                renderNumbers={true}
                hourHandWidth={6}
                hourMarksWidth={6}
                minuteHandWidth={4}
                minuteMarksWidth={3}
                secondHandWidth={2}
                />
            </div>
          }
        <div className="text-2xl font-medium">{currentTimename}</div>

        <div className="my-5 pt-5 flex gap-3 justify-center w-full">
          {active ? (
            <button
              type="button"
              className="flex gap-2 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
              onClick={() => {
                setActive(false);
                audio!.pause();
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
                audioContext?.resume();
                if (!audio!.ended && audio!.src) {
                  audio!.play();
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
              let hourPrompt = prompt("이동할 시");
              if (hourPrompt === null) return;

              let hour = Number(hourPrompt);

              let minutePrompt = Number(prompt("이동할 분"));
              if (minutePrompt === null) return;

              let minute = Number(minutePrompt);

              let newSeconds = hour * 60 * 60 + minute * 60 - 29100;

              if (isNaN(hour) || isNaN(minute)) {
                return alert("숫자만 입력하십시오.");
              }

              if (newSeconds < 0) {
                return alert("08시 05분 이후의 시간을 입력하십시오.");
              }

              audio!.pause();
              audio!.src = "";
              setSeconds(newSeconds);
              setDoneTimes(new Set());
            }}
          >
            <TbArrowsMoveHorizontal className="my-auto" size={18} /> 이동
          </button>

          {clockType !== CLOCKTYPE.DIGITAL ? (
            <button
              type="button"
              className="flex gap-3 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
              onClick={() => {
                setClockType(CLOCKTYPE.DIGITAL);
              }}
            >
              <TbId className="my-auto" size={17} /> 디지털
            </button>
          ) : (
            <button
              type="button"
              className="flex gap-3 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-3 py-2 rounded-lg"
              onClick={() => {
                setClockType(CLOCKTYPE.ANALOG);
              }}
            >
              <TbClock className="my-auto" size={17} /> 아날로그
            </button>
          )}
        </div>
      </div>

      <div
        className="bg-emerald-400 mt-0 h-1.5 rounded-sm"
        style={{
          width: `${(seconds / 30720) * 99.7}%`,
        }}
      />
      <div className="mt-0 w-[95%] flex gap-[1px] lg:gap-[4px]">
        {TIMELINE.map((one, i) => {
          return (
            <div
              key={i}
              className="relative"
              style={{
                width: `${(one.duration / 512) * 100}%`,
              }}
            >
              <div className=" bottom-[3rem] w-20 text-[10px] font-medium lg:text-base">
                {{
                  "0810": "국어",
                  "1015": "수학",
                  "1255": "영어",
                  "1435": "한국사",
                  "1525": "1선택",
                  "1602": "2선택",
                }[one.time] || "‎"}
              </div>
              <div className="bg-slate-300 h-1.5 mt-auto rounded-sm mb-1" />
              <div
                className={classNames(
                  "text-[10px] text-gray-600 h-9 w-[5px] tracking-tight leading-tight",
                  ["준비령", "입실준비", "예비령", "10분전", "5분전"].includes(
                    one.short
                  ) || one.time === "1600"
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

      <Transition show={infoOpen} as={Fragment}>
        <Dialog onClose={() => setInfoOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-xl rounded-xl bg-white p-6">
                <Dialog.Title className="text-2xl font-semibold">
                  개발자 & 정보
                </Dialog.Title>

                <hr className="my-3 -mx-1" />

                <Dialog.Description className="mb-3">
                  <p className="font-semibold mb-4">
                    개발자 - ArpaAP (Buyeon Hwang)
                  </p>
                  <p className="mb-4">
                    소프트웨어 개발자의 진로를 희망하는 05년생 학생입니다.
                  </p>
                  <p className="mb-4">
                    - 제 상세 프로필 및 포트폴리오는 GitHub에서 확인하실 수
                    있습니다:{" "}
                    <div className="pl-3">
                      <a
                        href="https://github.com/ArpaAP"
                        target="_blank"
                        className="underline"
                      >
                        https://github.com/ArpaAP
                      </a>
                    </div>
                  </p>
                  <p>
                    - 본 웹앱의 소스 코드는 아래 링크에서 확인하실 수 있습니다.
                    PR은 언제나 환영입니다!
                    <div className="pl-3">
                      <a
                        href="https://github.com/ArpaAP/csat-simulator"
                        target="_blank"
                        className="underline"
                      >
                        https://github.com/ArpaAP/csat-simulator
                      </a>
                    </div>
                  </p>
                </Dialog.Description>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setInfoOpen(false)}
                    className="flex gap-2 hover:bg-black/10 border border-gray-300 transition-all duration-300 my-auto px-4 py-2 rounded-lg"
                  >
                    닫기
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </main>
  );
}
