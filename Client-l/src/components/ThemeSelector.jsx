import React from 'react'

const ThemeSelector = ({ theme, setTheme }) => {
  return (
     <select
      className="bg-[#00ffaab4] text-black text-sm px-2 py-1 rounded outline-none"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="vs">Light</option>
      <option value="vs-dark">Dark</option>
      <option value="hc-black">High Contrast Black</option>
    </select>
  )
}

export default ThemeSelector