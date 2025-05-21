import { useState } from "react";

function IFrameLoader({ src, className }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ? <div className="loader"></div> : ""}
      <iframe
        src={src}
        className={className}
        onLoad={() => setLoaded(true)}
        width="350px"
        height="435px"
        style={{
          display: loaded ? "visible" : "hidden",
        }}
      />
    </>
  );
}

const displayFields = ["Shape", "Weight", "Color", "Clarity", "Price"];

export default function DiamondModal(diamond, getData) {
  const allData = getData(diamond);
  const sku = allData["SKU"];
  const available = allData["Availability"];
  const lab = allData["Lab"];
  const cert = allData["Cert #"];
  const videoUrl = allData["Video"];
  return () => (
    <div className="diamond-info">
      <div className="diamond-text-info">
      <h3>
        Stock #{sku} /{" "}
        {available === "Available" ? "Available for viewing" : "Pending Sale"}
      </h3>
      <ul>
        {displayFields.map((header) => (
          <li key={header}>
            <b>{header}</b>
            <br />
            {header === "Price" ? "$" + allData[header] : allData[header]}
          </li>
        ))}
      </ul>
      {lab === "IGI" ? (
        <a
          style={{ textAlign: "center", display: "block" }}
          href={`https://www.igi.org/verify-your-report/?r=${cert}`}
          target="_blank"
        >
          View Certificate
        </a>
      ) : (
        <span>Not Certified</span>
      )}
      </div>
      <IFrameLoader className="diamond-video" src={videoUrl} />
      <br />
    </div>
  );
}
