import React from 'react'

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select
      className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-3 py-1.5 rounded-md outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none min-w-[120px]"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="python">Python</option>
    </select>
  );
}

export default LanguageSelector