import Phase from "./Phase";

export default interface Note {
  title: string;
  content: string;
  phases: Phase[];
}