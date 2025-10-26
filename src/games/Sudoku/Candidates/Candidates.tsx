import styles from "./Candidates.module.css";

export const Candidates = ({ candidateList } : { candidateList: number[] }) => {
  return (
    <div className={styles.candidates}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i}>{candidateList.includes(i + 1) ? i + 1 : ""}</div>
      ))}
    </div>
  );
};