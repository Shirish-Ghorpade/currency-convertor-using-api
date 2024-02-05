// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  //1. Every UI changes sathi separate state banvnar
  const [amt, setAmt] = useState(1);
  const [fromCountry, setFromCountry] = useState("USD");
  const [toCountry, setToCountry] = useState("INR");
  const [op, setOp] = useState("");
  // 6. jevha pn data laod hot asel user la show kar ki data load hot ahe
  // form madhla data change karu naye mahun form la freeze kar loading sathi state banv
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      //2. useEffect cha funtion async allowed nahi mahun separate fucntion create kar
      // and kahli call kar
      async function fetchCurrenyOp() {
        // 7. isLoading true set kar laod kartana
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amt}&from=${fromCountry}&to=${toCountry}`
        );
        // Error handling
        if (!res.ok)
          throw new Error("Something went wrong while fetching data");
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Something is wrong");
        }
        // 3. All data right asel tar OP set kar state madhe
        // data.rates[toCountry] ya ne data acess karaycha data acess kasa karaycha hai given aste
        // api chya docs madhe
        // VVVVVVIMP TIPS:
        // 1. Learn JS wisely because me 1/2 hr data.rates.toCountry try karat hoto
        // 2. Jevha pn api fetch madhe error yet asel first check karayche te internet chalu ahe ka
        setOp(data.rates[toCountry]);
        // 8. isLoading false set kar laod zale ki
        setIsLoading(false);
      }
      // 4. Country same ahe so API madhe error yenar so, separate handle kar
      if (fromCountry === toCountry) return setOp(amt);
      fetchCurrenyOp();
    },
    [amt, fromCountry, toCountry]
  );
  return (
    <div>
      {/* 5. Basic component madhe split kele ahe */}
      {/* 9. isloading pass kela sarvana */}
      <InputAmt amt={amt} setAmt={setAmt} isLoading={isLoading} />
      <InputCountry
        country={fromCountry}
        setCountry={setFromCountry}
        isLoading={isLoading}
      />
      <InputCountry
        country={toCountry}
        setCountry={setToCountry}
        isLoading={isLoading}
      />
      <p>{op}</p>
    </div>
  );
}
function InputAmt({ amt, setAmt, isLoading }) {
  return (
    <input
      type="text"
      value={amt}
      onChange={(e) => setAmt(Number(e.target.value))}
      // 10. ithe disabled taku nako type  kartana issue hotoy
    />
  );
}

function InputCountry({ country, setCountry, isLoading }) {
  return (
    <select
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      // 10. HTML attribute ahe disabled true honar jevha isLoading true asnar
      disabled={isLoading}
    >
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}
