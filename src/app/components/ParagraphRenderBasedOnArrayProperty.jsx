import React from 'react'

export default function ParagraphRenderBasedOnArrayProperty({content, text}) {
  return (
    <p className="pb-2">  
    <span className="text-amber-100 font-bold">
      {text}: </span> 
    {content[0] == null ? `no ${text}` : content.map((tag) => tag.tag_name).join(",  ")}
</p>
  )
}
