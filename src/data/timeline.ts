import A001 from "../static/sounds/001.mp3";
import A002 from "../static/sounds/002.mp3";
import A003 from "../static/sounds/003.mp3";
import A004 from "../static/sounds/004.mp3";
import A005 from "../static/sounds/005.mp3";
import A006 from "../static/sounds/006.mp3";
import A007 from "../static/sounds/007.mp3";
import A008 from "../static/sounds/008.mp3";
import A009 from "../static/sounds/009.mp3";
import A010 from "../static/sounds/010.mp3";
import A011 from "../static/sounds/011.mp3";
import A012 from "../static/sounds/012.mp3";
import A013 from "../static/sounds/013.mp3";
import A014 from "../static/sounds/014.mp3";
import A015 from "../static/sounds/015.mp3";
import A016 from "../static/sounds/016.mp3";
import A017 from "../static/sounds/017.mp3";
import A018 from "../static/sounds/018.mp3";
import A019 from "../static/sounds/019.mp3";
import A020 from "../static/sounds/020.mp3";
import A021 from "../static/sounds/021.mp3";
import A022 from "../static/sounds/022.mp3";
import A023 from "../static/sounds/023.mp3";
import A024 from "../static/sounds/024.mp3";
import A025 from "../static/sounds/025.mp3";
import A026 from "../static/sounds/026.mp3";
import A027 from "../static/sounds/027.mp3";
import A028 from "../static/sounds/028.mp3";
import A029 from "../static/sounds/029.mp3";
import A030 from "../static/sounds/030.mp3";
import A031 from "../static/sounds/031.mp3";

const TIMELINE: {
  time: string;
  description: string;
  short: string;
  duration: number;
  audio: string | null;
}[] = [
  {
    time: "0805",
    description: "1교시 입실준비",
    short: "입실준비",
    duration: 5,
    audio: A001,
  },
  {
    time: "0810",
    description: "1교시 입실완료",
    short: "입실완료",
    duration: 15,
    audio: A002,
  },
  {
    time: "0825",
    description: "1교시 국어 예비령",
    short: "예비령",
    duration: 10,
    audio: A003,
  },
  {
    time: "0835",
    description: "1교시 국어 준비령",
    short: "준비령",
    duration: 5,
    audio: A004,
  },
  {
    time: "0840",
    description: "1교시 국어 본령",
    short: "본령",
    duration: 70,
    audio: A005,
  },
  {
    time: "0950",
    description: "1교시 국어 종료 10분전",
    short: "10분전",
    duration: 10,
    audio: A006,
  },
  {
    time: "1000",
    description: "1교시 종료령",
    short: "종료령",
    duration: 15,
    audio: A007,
  },
  {
    time: "1015",
    description: "2교시 입실",
    short: "입실",
    duration: 5,
    audio: A008,
  },
  {
    time: "1020",
    description: "2교시 수학 예비령",
    short: "예비령",
    duration: 5,
    audio: A009,
  },
  {
    time: "1025",
    description: "2교시 수학 준비령",
    short: "준비령",
    duration: 5,
    audio: A010,
  },
  {
    time: "1030",
    description: "2교시 수학 본령",
    short: "본령",
    duration: 90,
    audio: A011,
  },
  {
    time: "1200",
    description: "2교시 수학 종료 10분전",
    short: "10분전",
    duration: 10,
    audio: A012,
  },
  {
    time: "1210",
    description: "2교시 종료령",
    short: "종료령",
    duration: 45,
    audio: A013,
  },
  {
    time: "1255",
    description: "3교시 입실",
    short: "입실",
    duration: 5,
    audio: A014,
  },
  {
    time: "1300",
    description: "3교시 영어 예비령",
    short: "예비령",
    duration: 5,
    audio: A015,
  },
  {
    time: "1305",
    description: "3교시 영어 준비령",
    short: "준비령",
    duration: 5,
    audio: A016,
  },
  {
    time: "1310",
    description: "3교시 영어 본령",
    short: "본령",
    duration: 60,
    audio: null,
  },
  {
    time: "1410",
    description: "3교시 영어 종료 10분전",
    short: "10분전",
    duration: 10,
    audio: A017,
  },
  {
    time: "1420",
    description: "3교시 종료령",
    short: "종료령",
    duration: 15,
    audio: A018,
  },
  {
    time: "1435",
    description: "4교시 한국사 입실",
    short: "입실",
    duration: 5,
    audio: A019,
  },
  {
    time: "1440",
    description: "4교시 한국사 예비령",
    short: "예비령",
    duration: 5,
    audio: A020,
  },
  {
    time: "1445",
    description: "4교시 한국사 준비령",
    short: "준비령",
    duration: 5,
    audio: A021,
  },
  {
    time: "1450",
    description: "4교시 한국사 본령",
    short: "본령",
    duration: 25,
    audio: A022,
  },
  {
    time: "1515",
    description: "4교시 한국사 종료 5분전",
    short: "5분전",
    duration: 5,
    audio: A023,
  },
  {
    time: "1520",
    description: "4교시 한국사 종료령",
    short: "종료령",
    duration: 5,
    audio: A024,
  },
  {
    time: "1525",
    description: "4교시 탐구 준비령",
    short: "준비령",
    duration: 5,
    audio: A025,
  },
  {
    time: "1530",
    description: "4교시 탐구 제1선택 본령",
    short: "본령",
    duration: 25,
    audio: A026,
  },
  {
    time: "1555",
    description: "4교시 탐구 제1선택 종료 5분전",
    short: "5분전",
    duration: 5,
    audio: A027,
  },
  {
    time: "1600",
    description: "4교시 탐구 제1선택 종료령",
    short: "종료령",
    duration: 2,
    audio: A028,
  },
  {
    time: "1602",
    description: "4교시 탐구 제2선택 본령",
    short: "본령",
    duration: 25,
    audio: A029,
  },
  {
    time: "1627",
    description: "4교시 탐구 제2선택 종료 5분전",
    short: "5분전",
    duration: 5,
    audio: A030,
  },
  {
    time: "1632",
    description: "4교시 탐구 제2선택 종료령",
    short: "종료령",
    duration: 0,
    audio: A031,
  },
];

export default TIMELINE;
