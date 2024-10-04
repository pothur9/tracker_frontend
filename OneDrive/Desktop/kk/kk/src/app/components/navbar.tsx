import React, { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useRouter } from "next/navigation";
import logo from '../images/kk logo.png';

function Navbar() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const router = useRouter();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <img src="/kk logo.png" alt="logo" style={{width:"140px",height:"120px"}}/>
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          <li><a>{router.locale === "en" ? "Home" : router.locale}</a></li>
          <li><a>{router.locale === "en" ? "Contact Us" : router.locale}</a></li>
          <li><a>{router.locale === "en" ? "About Us" : router.locale}</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <select
          className="select select-bordered"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="kn">Kannada</option>
          <option value="hi">Hindi</option>
       
        </select>
        <a className="btn">{router.locale === "en" ? "Join Us" : router.locale}</a>
      </div>
    </div>
  );
}

export default Navbar;

