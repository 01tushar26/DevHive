import React from 'react'
import LanguageSelector from './LanguageSelector'
const EditorToolBar = ({ language, setLanguage }) => {
  return (
   <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <h1 className="text-sm font-semibold text-white">Dev Editor</h1>

      <div className="flex items-center gap-2">
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
        />

        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white">
          Run
        </button>
      </div>
    </div>
  )
}

export default EditorToolBar