import { useState } from 'react';

export default function Submit({ props }) {
  const { submit, answers, admin } = props;
  const [error, setError] = useState('');

  function submitAnswers() {
    // if no nulls in any answers object
    if (answers.every((a) => a && a.qid && a.answer)) {
      setError('');
      submit(answers);
    } else {
      let temp = '';
      for (let i = 0; i < answers.length; i += 1) {
        if (!answers[i] || answers[i].answer == null) temp += `${answers[i].idx}, `;
      }
      temp = temp.slice(0, -2); // remove trailing comma
      setError(temp);
    }
  }

  function handleSubmit() {
    if (admin) submit();
    else submitAnswers();
  }

  let errorDiv = <></>;
  if (error !== '') {
    errorDiv = (
      <pre className="signup-error">
        Please make sure you answer every question in the survey.
        <br />
        Question(s) required:
        {' '}
        <b>{error}</b>
      </pre>
    );
  } else {
    errorDiv = (
      <></>
    );
  }

  return (
    <>
      {errorDiv}
      <div
        className="survey-submit"
        role="button"
        tabIndex={0}
        onClick={() => handleSubmit()}
        onKeyDown={() => handleSubmit()}
        data-testid="submitSurvey"
      >
        {admin ? 'Save' : 'Submit'}
      </div>
    </>
  );
}
