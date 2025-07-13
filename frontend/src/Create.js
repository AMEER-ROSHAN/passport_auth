import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './passportAuth.css';

const countries = ['India', 'United States', 'Canada', 'Japan', 'Germany', 'Australia', 'France'];

const PassportCreate = ({ web3, account, contract }) => {
  const [passportNumber, setPassportNumber] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreatePassport = async () => {
    setError('');
    setSuccess('');

    const passportRegex = /^[0-9]{8}$/;
    const nameRegex = /^[A-Za-z ]{2,}$/;

    if (!passportRegex.test(passportNumber)) {
      setError('Invalid Passport Number (e.g., 01234567)');
      return;
    }

    if (!nameRegex.test(name)) {
      setError('Invalid Name (letters and spaces only)');
      return;
    }

    if (!country) {
      setError('Please select a country');
      return;
    }

    if (!issueDate || !expiryDate) {
      setError('Please select both issue and expiry dates');
      return;
    }

    const issueDateTimestamp = Math.floor(new Date(issueDate).getTime() / 1000);
    const expiryDateTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

    if (issueDateTimestamp < 0 || expiryDateTimestamp < 0) {
      setError('Issue or expiry date is invalid (before 1970)');
      return;
    }

    if (expiryDateTimestamp <= issueDateTimestamp) {
      setError('Expiry date must be after issue date');
      return;
    }

    try {
      await contract.methods
        .createPassport(passportNumber, name, country, issueDateTimestamp, expiryDateTimestamp)
        .send({ from: account });

      setSuccess('Passport created successfully!');
      setQrCode(account);
    } catch (err) {
      setError('Blockchain Error: ' + err.message);
    }
  };

  const generateDownloadLink = () => {
    if (qrCode) {
      const canvas = document.getElementById('qr-code-canvas');
      if (canvas) {
        const qrCodeURL = canvas.toDataURL('image/png');
        setDownloadLink(qrCodeURL);
        const link = document.createElement('a');
        link.href = qrCodeURL;
        link.download = 'passport-qr-code.png';
        link.click();
      }
    }
  };

  return (
    <div>
      <h3 className="section-title">Create Passport</h3>

      <div className="form-group">
        <input
          type="text"
          placeholder="Passport Number (e.g. 12345678)"
          value={passportNumber}
          onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Passport Issue Date</label>
        <input
          type="date"
          value={issueDate}
          min="1970-01-01"
          onChange={(e) => setIssueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Passport Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          min="1970-01-01"
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <button className="button" onClick={handleCreatePassport}>
        Submit
      </button>

      {qrCode && (
        <div>
          <h3>QR Code for Verification</h3>
          <QRCodeCanvas id="qr-code-canvas" value={qrCode} size={256} />
          <br />
          <button className="button" onClick={generateDownloadLink}>
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default PassportCreate;
