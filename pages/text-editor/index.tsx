import React, { useState, useCallback, useMemo, Children, useRef, useEffect } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { withHistory } from "slate-history"
import { BaseEditor, Descendant, Editor, Transforms, Text } from 'slate'
import { ReactEditor, RenderElementProps } from 'slate-react'
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }
declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}
const Index = () => {
    const [open, setOpen] = useState(false)
    const [scode, setScode] = useState("")
    const editor = useMemo(() => withReact(withHistory(createEditor())), []);
    useMemo(() => {
        Transforms.select(editor, { offset: 0, path: [0, 0] });
    }, []);
    const [value, setValue] = useState<Descendant[]>([
        {
            type: 'paragraph',

            children: [{ text: "Test" }]


        }

    ])
    const editorRef = useRef<HTMLDivElement>(null)
    const opnethemodal = () => {
        setOpen(true)
    }
    const closeTheModal = () => {
        setOpen(false)
    }

    const isMarkActive = (editor: BaseEditor & ReactEditor, format: string,) => {

        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    }




    const toggleBold = () => {
        if (isMarkActive(editor, "bold")) {
            editor.removeMark("bold")
        } else {
            editor.addMark("bold", true)
        }



    }
    const toggleItalic = () => {
        if (isMarkActive(editor, "italic")) {
            editor.removeMark("italic")
        } else {
            editor.addMark("italic", true)
        }
    }
    const toggleUnderline = () => {
        if (isMarkActive(editor, "underline")) {
            editor.removeMark("underline")
        } else {
            editor.addMark("underline", true)
        }
    }
    const renderElement = (props: any) => {
        console.log("render function is called and the props are ", { props })
        switch (props.element.type) {
            case "blue":
                return <h2 {...props.attributes} className="text-blue-500">{props.children}</h2>
            case "red":
                return <h2 {...props.attributes} className="text-red-500">{props.children}</h2>
            case "image":
                return (
                    <img src={props.children[0]} />
                )
            case 'url':
                return (
                    <a href={props.element.children[0].text} target="_" >{props.children}</a>
                )
            default:

                return <h1 {...props.attributes}
                    className="text-black" >{props.children}</h1>
        }

    }
    const Leaf = ({ attributes, children, leaf }) => {
        if (leaf.bold) {
            children = <strong>{children}</strong>
        }

        if (leaf.code) {
            children = <code>{children}</code>
        }

        if (leaf.italic) {
            children = <em>{children}</em>
        }

        if (leaf.underline) {
            children = <u>{children}</u>
        }

        return <span {...attributes}>{children}</span>
    }
    const renderLeaf = useCallback((props: any) => {
        return <Leaf {...props} />
    }, [])
    const sourceCode = () => {
        opnethemodal()
        const element = document.querySelector("[data-slate-editor=true]")
        const domparser = new DOMParser()
        // element?.outerHTML
        // setScode(element!?.outerHTML.)
        // console.log(element?.outerHTML)
        console.log(`
        <div role="textbox" data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1" style="position:relative;outline:none;white-space:pre-wrap;word-wrap:break-word"><h1 data-slate-node="element" class="text-black"><span data-slate-node="text"><span data-slate-leaf="true"><span data-slate-string="true">Test mahesh </span></span></span></h1></div>
        
        `)
    }



    useEffect(() => {
        editorRef.current?.focus()
    }, [])
    return (
        <div className='w-screen relative flex justify-center items-center h-screen bg-blue-500'>
            {open ? <div className='absolute top-0 bg-black text-white w-screen h-screen'>
                <div>{scode}</div>
                <button onMouseDown={closeTheModal}>close</button>

            </div> : undefined}
            <div className='w-[45%] h-[80%] bg-white rounded-md overflow-hidden p-2'>
                <div className=' toolbar w-full flex items-center gap-2 h-[50px] border  '>
                    <div onMouseDown={toggleBold} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>B</div>
                    <div onMouseDown={toggleItalic} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>I</div>
                    <div onMouseDown={toggleUnderline} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>u</div>
                    <div onMouseDown={() => {
                        const url = prompt("enter a url")
                        console.log(url)
                        editor.insertNode([{ type: "url", children: [{ text: url }] }])
                    }} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>url</div>
                    <div onMouseDown={sourceCode} >source code</div>
                </div>
                <div className='h-[calc(100%-50px)] overflow-y-auto border border-black'>
                    <Slate editor={editor} value={value} onChange={(val) => {

                        console.log({ val, editor })
                    }}


                    >
                        <div ref={editorRef} >

                            <Editable
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                                autoFocus={true}

                            // onKeyDown={(e) => {
                            //     editor.insertText("and")
                            // }}
                            />
                        </div>
                    </Slate>
                </div>
            </div>



        </div>
    )
}

export default Index