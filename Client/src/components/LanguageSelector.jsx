import React from 'react'

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select
      className="bg-[#00ffaab4] text-black text-sm px-2 py-1 rounded outline-none"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
    </select>
  );
}

export default LanguageSelector