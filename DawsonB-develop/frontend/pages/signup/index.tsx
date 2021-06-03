/* eslint-disable max-len */
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import useLocalStorage from '../../functions/useLocalStorage';

function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [client, setClient] = useState(false);
  const [error, setError] = useState('');

  const [, setAuth] = useLocalStorage('auth', { email: null, authkey: null });
  const [, setPrefs] = useLocalStorage('prefs', {
    first_name: null,
    last_name: null,
    date_created: null,
    last_login: null,
    isClient: null,
    isAdmin: null,
    circle_colors: null,
    circle_rank: null,
    notify_time: null,
    avatar: null,
  });
  const [survey, setSurvey] = useLocalStorage('survey', []);

  const router = useRouter();

  const validate = () => {
    let errorText = '';

    if (firstName.length === 0) {
      errorText += 'Enter your first name\n';
    }

    if (lastName.length === 0) {
      errorText += 'Enter your last name\n';
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      errorText += 'Enter a valid email address\n';
    }

    if (password.length < 8) {
      errorText += 'Choose a password with at least 8 characters\n';
    }

    if (password !== confirmPass) {
      errorText += 'Passwords do not match!';
    }

    setError(errorText);
    return errorText === '';
  };

  const submitAnswers = async (authkey) => {
    let valid = false;
    if (authkey != null) {
      await fetch('/api/submitAnswers', {
        method: 'POST',
        body: JSON.stringify({
          answers: survey,
          authkey,
        }),
      }).then((response) => response.json())
        .then(async (response) => {
          if (!response.error) {
            await setSurvey([]);
            valid = true;
          }
        });
    }
    return valid;
  };

  const getPrefs = async (authkey) => {
    let valid = false;
    await fetch('/api/getPrefs', {
      method: 'POST',
      body: JSON.stringify({
        authkey,
      }),
    }).then((response) => response.json())
      .then(async (response) => {
        // add prefs to context
        if (!response.error) {
          await setPrefs({
            ...response,
            avatar: response.avatar.split(','),
            circle_rank: response.circle_rank.split(''),
            circle_colors: response.circle_colors.split(','),
          });
          valid = true;
        } else {
          setError('Unable to create account.\nPlease try submitting again.');
          setAuth({
            email: null,
            authkey: null,
          });
        }
      });
    return valid;
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    let valid = true;

    fetch('/api/createAccount', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        isClient: client,
      }),
    }).then((response) => response.json())
      .then(async (response) => {
        // add email/authkey to context
        if (!response.error && response.authkey !== null && response.prefs !== null) {
          if (await getPrefs(response.authkey) === false) valid = false;
          if (survey.length > 0 && await submitAnswers(response.authkey) === false) valid = false;
          await setAuth({
            email,
            authkey: response.authkey,
          });

          if (valid) router.push('/');
        } else {
          setError('Unable to create account.\nPlease try submitting again.');
        }
      });
  };

  let errorDiv = <></>;
  if (error !== '') {
    errorDiv = (
      <pre className="signup-error">
        <b>Please fix the following error(s):</b>
        <br />
        {error}
      </pre>
    );
  }

  return (
    <div>
      <Head>
        <title>VHC - Virtual Health Circles</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="page">
        <p className="page-title">Sign Up</p>

        <div className="tsx-head">
          <p className="topper">
            By completing the form and clicking the signup button,
            you agree that you have have read the
            <i> Terms & Conditions </i>
            below.
          </p>
        </div>
        <div className="termsx">
          <p className="hBlock"><strong>Privacy Policy:</strong></p>
          <p className="pBlock">
            Dawson Psychological Services, Inc. is committed to protecting and respecting your
            privacy in connection with your use of our Health Circles resources, including the Health
            Circles app and the Health Circles Therapy program, together referred to as “Health Circles”.
            Applicable privacy laws, including British Columbia’s Personal Information Protection Act and the
            federal Personal Information Protection and Electronic Documents Act, set out rules for the collection,
            use, disclosure, security, retention and destruction of personal information.
          </p>
          <p className="pBlock">
            This privacy policy outlines how any personal information we collect from you is handled, or that you
            provide to us, in connection with Health Circles. Please read the following carefully to understand our
            practices regarding your personal information and how we will collect, use, secure, and disclose your personal
            information. This privacy policy forms a part of and is incorporated into the Terms and Conditions for Health Circles.
          </p>
          <p className="pBlock">
            Dawson Psychological Services, Inc. reserves the right to change or update this privacy policy and will notify users by
            posting any updates. Any changes or updates will be effective immediately upon posting to www.psychologicalhealth.com.
            Your continued use of Health Circles constitutes your agreement to abide by the privacy policy as changed. We may also
            elect to notify you of changes or updates to this policy by additional means, such as pop-up or push notifications within
            Health Circles or by email.
          </p>
          <p className="tblock">1. Information We Collect</p>
          <p className="pBlock">
            Dawson Psychological Services, Inc. is committed to limiting our collection of your personal information to only the information
            that is necessary to fulfill the reasonable purposes that we identify to you at or before the time of collection. These purposes
            are also summarized at sections 7 (Uses Made of the Information) and 8 (Disclosure of Your Information) of this privacy policy.
          </p>
          <p className="pBlock">We may collect and process the following information about you:</p>
          <p className="pBlock">
            • Personal information including, for example, your name, e-mail address, telephone, location, information about your usage of
            Health Circles and information collected by tracking technologies as further described below that may identify you as an individual
            or allow online or offline contact with you as an individual.
          </p>
          <p className="pBlock">
            • Device Information such as operating system version, device type, and system performance information.
          </p>
          <p className="pBlock">
            • If you opt to become a participant in Health Circles Therapy program, we will also collect personal information, including
            information about the nature and severity of your mental health symptoms, directly from you for the following purposes:
          </p>
          <ul>
            <li>To assess whether Health Circles Therapy is an appropriate form of treatment for you;</li>
            <li>
              If you are a minor, to determine whether you are able to consent on your own behalf to participate in Health Circles Therapy,
              or whether consent from your parent/guardian is required;
            </li>
            <li>
              To enable you to participate in the Health Circles Therapy sessions via online webinar either individually or in group. You may be offered a choice between individual therapy sessions or
              group therapy sessions. You may opt for either, neither, or both. Depending on scheduling, individual or group therapy may not be available at the time you prefer. In individual sessions,
              it is anticipated that you will share personal details between yourself and your therapist that remain confidential between you and your therapist. In group sessions, it is anticipated
              that all Group members will share personal details amongst themselves and the Group facilitator(s) for the purpose of fully engaging in the Group therapy sessions; and
            </li>
            <li>
              To assess post-treatment the relative success (or not) of your treatment as compared to the symptoms you were experiencing and how you were coping with them pre-treatment.
            </li>
          </ul>
          <p className="tblock">2. Confidentiality and Security</p>
          <p className="pBlock">
            The security of your personal information is important to us. We follow generally accepted standards to protect the personal information you submit to us. We use strict internal
            procedures and technical security features to try to prevent unauthorized access, use or disclosure of your personal information. If you have any questions about the security of
            your personal information, you can contact us at
            <a id="emailus" href="mailto:healthcircles@psychologicalhealth.com"> healthcircles@psychologicalhealth.com.</a>
          </p>
          <p className="pBlock">
            Unfortunately, the transmission of information via the Internet is not completely secure. Although we will do our best to protect your personal information, we cannot guarantee
            the security of your information transmitted to or from Health Circles; any transmission of information is at your own risk.
            In addition, ensuring the security and confidentiality of your personal information, and the personal information of others if you are participating in a Health Circles Therapy program, is
            a responsibility that we share with you. Your use of the Health Circles Therapy Program via options provided in the Health Circles app and your participation in webinar sessions should take
            place in an appropriately private space to ensure that neither you nor, in the case of Health Circles group therapy, other Group members can be seen or overheard. Once you qualify for the
            Health Circles Therapy program, the responsibility for maintaining privacy, confidentiality of your information is shifted from Health Circles to your therapist.
          </p>
          <p className="tblock">3. Protecting Your Password</p>
          <p className="pBlock">
            Where we have given you (or where you have chosen) a password which enables you to access parts of Health Circles, you are responsible for keeping this password confidential. We ask you not
            to share a password with anyone and suggest that you change your password frequently. If you have enabled your device to access the app without entering a password, you are also responsible
            for ensuring your personal information is protected by not allowing others to use your device without your permission.
          </p>
          <p className="tblock">4. Email or Text Communication</p>
          <p className="pBlock">
            If you sign up to receive promotional materials from us via email or text communications, we will use the information you give us to provide the communications you requested.
            If you inform us that you wish to cancel email promotional materials by selecting “unsubscribe” at the bottom of such communication or by emailing us at
            <a id="emailus" href="mailto:healthcircles@psychologicalhealth.com"> healthcircles@psychologicalhealth.com</a>
            , we will remove you from our mailing list.
          </p>
          <p className="tblock">5. Mobile Analytics</p>
          <p className="pBlock">
            We use mobile analytics software to allow us to better understand the functionality of our mobile software on your device. This software may record information such as how often you
            engage with Health Circles, the events that occur within Health Circles, aggregated usage and performance data, and where Health Circles was downloaded from. We may link the information
            we store within the analytics software to any personal information you submit within the mobile application. The reasons we collect this data include: to understand which parts of the app
            consumers are using or not using, to be able to understand level of engagement with the app and areas that require improvement or change. If you opt to be a participant in Health Circles
            research, your data will be aggregated and anonymized data before reporting to sponsors or academic publications.
          </p>
          <p className="tblock">6. Where We Store Your Personal Information</p>
          <p className="pBlock">
            All information you provide to us through Health Circles is stored on secure servers located in Canada. In using Health Circles, you are deemed to acknowledge and agree that we may access
            and store your personal information in Canada for the purposes set out in this privacy policy and the Terms of Use. As a result, your personal information will be subject to the laws of Canada.
          </p>
          <p className="tblock">7. Uses Made of the Information</p>
          <p className="pBlock">We use information held about you in the following ways:</p>
          <ul>
            <li>
              To ensure that content provided by Health Circles is presented in the most effective manner for your mobile device.
            </li>
            <li>
              To provide you with feedback on your self-reported health and to improve the app.
            </li>
            <li>
              To provide you with information related to Health Circles that will facilitate your engagement with Health Circles.
            </li>
            <li>
              To provide information to you for your own use. The information provided is for the purpose of self- help and is not
              clinical advice. It is recommended that Health Circles be used as an adjunct to discussions with a therapist licensed
              to provide clinical advice. Your use of any information you receive from Health Circles is entirely your own responsibility
              and you agree to save Health Circles and Dawson Psychological Services, Inc. harmless from any prosecution that arises
              from misuse of such information.
            </li>
            <li>
              To provide you with promotional communications, such as email, to the extent that you have provided consent to receive such
              communications under applicable law.
            </li>
            <li>
              To carry out our obligations arising from any agreements entered into between you and us.
            </li>
            <li>
              To allow you to participate in interactive features of Health Circles, when you choose to do so.
            </li>
            <li>
              To notify you about changes to Health Circles.
            </li>
            <li>
              To understand your broad, non-specific geographic location to help us identify groups of users by general geographic market
              (such as postal code, province or country).
            </li>
            <li>
              We may also ask you to complete surveys that we use for research purposes, although you do not have to respond to them. You will
              be able to use the same services of Health Circles whether or not you complete the surveys.
            </li>
            <li>
              Some data from these surveys will be personalized to you but will be anonymized and aggregated before being published on
              www.psychologicalhealth.com or other publication.
            </li>
          </ul>
          <p className="tblock">
            8. Disclosure of Your Information
          </p>
          <p className="pBlock">
            We do not generally disclose your personal information. We do not provide your personal information to any third party without your specific
            consent, except as permitted or required by law. For example, we may disclose your personal information to third parties as follows:
          </p>
          <ul>
            <li>
              If Health Circle’s service providers (like hosting or market analytics) require this information to provide services to Dawson Psychological
              Services, Inc.. Dawson Psychological Services, Inc. requires each of its service providers to agree to maintain the confidentiality and security
              of your personal information to our standards.
            </li>
            <li>
              If Health Circles or substantially all of our assets are acquired by a third party, there is a risk that personal information held by us about our users may be transferred.
            </li>
            <li>
              If we are under a legal duty to disclose or share your personal information in order to comply with any legal obligation such as to comply with a subpoena, bankruptcy proceedings,
              similar legal process, or in order to enforce or apply our agreements with you; or to protect the rights, property, or safety of Health Circles, our customers, or others.
            </li>
            <li>
              If, in the context of applying to participate, or participating in the Health Circles Therapy Program you disclose the type of information specifically identified on the Health Circles
              Therapy Program Participant Acknowledgement, in which case we may have a legal and/or ethical obligation to disclose some of that information to the appropriate authorities, the court and/or your parent/guardian.
            </li>
          </ul>
          <p className="tblock">
            9. Accuracy and Correction of Information
          </p>
          <p className="pBlock">
            We make reasonable efforts to ensure that your personal information that we collect, use and disclose in accordance with this Policy is accurate and complete. We need your help to accomplish this. Given that in the
            vast majority of cases we will collect your personal information directly from you, we rely on you to provide us with accurate information, and to update that information as and when needed.
          </p>
          <p className="pBlock">
            Whether or not we have collected your personal information directly from you, you have the right to request access to that information and to request that we correct any errors in or omissions from that information.
            If your request for correction is reasonable, and subject to any legal obligations we might have that require us not to correct the information (e.g. we cannot correct a healthcare professional’s clinical opinions),
            we will correct the information. Where appropriate, we will also send the corrected information to any organizations to which we have disclosed your personal information during the year prior to your correction request.
            If your request for correction is not reasonable, or cannot be granted for any other reason, we will nevertheless include a note in the file where the information is held to show that a request for correction was made, but not implemented.
          </p>
          <p className="tblock">
            10. Limited Retention of Information
          </p>
          <p className="pBlock">
            Generally speaking, we will retain the personal information we collect from or about you only for so long as we require it to satisfy the purposes for which we collected the information. We will also retain your personal information for as
            long as is required to meet our various legal and business obligations, which in some cases might be for a longer period than is necessary to satisfy the purposes for collection.
          </p>
          <p className="pBlock">
            In particular, if we use any of your personal information to make a decision that directly affects you (e.g. to decide whether you are eligible to participate in a Health Circles Therapy Program), we are legally required to retain that
            information for at least one year after the date we use the information to make the decision. This is for the purpose of giving you time to request access to your personal information. Once there is no longer a legal requirement or
            business purpose to retain your personal information we will securely delete, destroy or anonymize it.
          </p>
          <p className="tblock">
            11. Withdrawal of consent
          </p>
          <p className="pBlock">
            You may withdraw consent by advising Health Circles by email at
            <a id="emailus" href="mailto:info@healthcircles.com"> info@healthcircles.com</a>
            , stopping your use of Health Circles, or by deleting your data from Health Circles.
          </p>
          <p className="pBlock">
            Deleting your data from Health Circles does not delete your data from therapists or other participants who have been affliliated with you (in Health Circles Therapy Program) while you were a participant in Health Circles.
          </p>
          <p className="tblock">
            12. Contact us with Questions
          </p>
          <p className="pBlock">
            If you have any questions or concerns about your personal information or privacy, or if you would like to request access to or correction of your personal information that we hold, you can contact us at
            <a href="mailto:healthcircles@psychologicalhealth.com" id="emailus"> healthcircles@psychologicalhealth.com.</a>
          </p>
          <p className="hBlock">
            <strong>Copyright.</strong>
          </p>
          <p className="pBlock">
            The material on Health Circles is covered by the provisions of the Copyright Act, and relevant Canadian laws, policies, regulations, and international agreements. Copyright grants the sole and exclusive right to produce,
            reproduce, publish, adapt, and use telecommunicate a work to the holder of the copyright, subject to some exceptions. In order to perform any of these actions, permission must be obtained from the individual copyright owner.
            Copyright subsists in all material hosted on this app.
          </p>
          <p className="pBlock">
            The copyright information provided on Health Circles is provided as general information only, and is not intended to provide specific legal or medical advice for any individual and should not be relied on as such. It is strongly
            recommended that any information you take from this site is used in collaboration with a licensed health services provider.
          </p>
          <p className="tblock1">
            Permissions.
          </p>
          <p className="tblock">
            <i>Commercial Reproduction</i>
          </p>
          <p className="pBlock">
            Reproduction, distribution, transmission, or publication of any material in or on Health Circles for commercial purposes, whether in whole or in part, is strictly prohibited without the written consent of Dawson Psychological Services, Inc..
            To obtain written consent, please email
            <a href="mailto:info@dawsonpsychologicalservices.com" id="emailus"> info@dawsonpsychologicalservices.com. </a>
          </p>
          <p className="pBlock">
            A commercial purpose or use is use of material by a commercial entity or by a non- profit entity for profit-making or other commercial purposes.
          </p>
          <p className="tblock">
            Non-Commercial Reproduction
          </p>
          <p className="pBlock">
            Unless otherwise indicated, information on Health Circles and Psychologicalhealth.com has been posted for the purpose of making it readily available for personal and public non-commercial use. The material may be reproduced for personal purposes,
            in whole or in part, without charge or further permission from Dawson Psychological Services, Inc., provided that Dawson Psychological Services, Inc. is identified as the source of the material, the material is reproduced in full without any changes,
            no charges are made for the use of the material, and any associated copyright or other proprietary notices are retained. If a user wishes to make a change to material on this site for personal purposes, the written permission of Dawson Psychological Services, Inc.
            is required. Please contact
            {' '}
            <a id="emailus" href="mailto:info@dawsonpsychologicalservices.com">info@dawsonpsychologicalservices.com.</a>
          </p>
          <p className="pBlock">
            Links hosted on www.psychologicalhealth.com
            or on Health Circles may be shared without charge or further permission from Dawson Psychological Services, Inc., provided that the link is not shared for commercial purposes. If any content retrieved from a link is reproduced,
            please reproduce the link as the source of the content.
          </p>
          <p className="pBlock">
            Any permission request under this Copyright and Permission Policy is considered on a case-by-case basis, and the granting of permission is at the sole discretion of Dawson Psychological Services, Inc.
          </p>
        </div>

        <form className="signup-form" onSubmit={submitHandler}>
          <div className="signup-form-container">
            <div className="signup-container">
              <label htmlFor="firstName" className="signup-label">
                First Name
              </label>
              <label htmlFor="lastName" className="signup-label">
                Last Name
              </label>
              <label htmlFor="email" className="signup-label">
                Email Address
              </label>
              <label htmlFor="pass" className="signup-label">
                Password
              </label>
              <label htmlFor="confirmPass" className="signup-label">
                Confirm Password:
              </label>
              <label htmlFor="pass" className="signup-label">
                Are you a client of Dr. Dawson?
              </label>
            </div>
            <div className="signup-container">
              <input type="text" name="firstName" onChange={(event) => setFirstName(event.target.value)} />
              <input type="text" name="lastName" onChange={(event) => setlastName(event.target.value)} />
              <input type="email" name="email" onChange={(event) => setEmail(event.target.value)} />
              <input type="password" name="pass" onChange={(event) => setPassword(event.target.value)} />
              <input type="password" name="confirmPass" onChange={(event) => setConfirmPass(event.target.value)} />
              <input type="checkbox" name="client" onChange={(event) => setClient(event.target.checked)} />
            </div>
          </div>
          {errorDiv}
          <div style={{ textAlign: 'center' }}>
            <input type="submit" name="submit" value="Sign Up" className="signup-submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
