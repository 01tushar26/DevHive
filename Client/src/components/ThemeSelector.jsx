import React from 'react'

const ThemeSelector = ({ theme, setTheme }) => {
  return (
     <select
      className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-3 py-1.5 rounded-md outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none min-w-[140px]"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="vs-dark">VS Dark</option>
      <option value="vs">VS Light</option>
      <option value="hc-black">High Contrast</option>
    </select>
  )
}

export default ThemeSelector