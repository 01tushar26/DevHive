import React from 'react'

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select
      className="bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant text-sm px-3 py-1.5 rounded-md outline-none focus:border-primary-container transition-colors cursor-pointer appearance-none min-w-[120px]"
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