export const Candidates = ({ candidateList } : { candidateList: number[] }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(3, 1fr)",
      width: "100%",
      height: "100%",
      fontSize: "0.6em",
      textAlign: "center"
    }}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i}>{candidateList.includes(i + 1) ? i + 1 : ""}</div>
      ))}
    </div>
  );
};