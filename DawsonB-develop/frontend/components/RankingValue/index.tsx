export default function RankingValue({ props }) {
  const { index } = props;

  return (
    <div className="question-rank-value">
      <p className="question-rank-value-text">{index + 1}</p>
    </div>
  );
}
