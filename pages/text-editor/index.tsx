import React, { useState, useCallback } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, } from 'slate-react'
// TypeScript users only add this code for slate
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
// end of imprt of types for slate
const Index = () => {
    // Create a Slate editor object that won't change across renders.
    const [editor] = useState(() => withReact(createEditor()))
    const initialValue: Descendant[] = [
        {
            type: 'paragraph',
            children: [{ text: 'A line of text in a paragraph.' }],
        },
    ]
    // Define a React component to render leaves with bold text.
    const Leaf = (props: any) => {
        return (
            <span
                {...props.attributes}
                style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
            >
                {props.children}
            </span>
        )
    }
    const CodeElement = (props: RenderElementProps) => {
        return (
            <pre {...props.attributes}>
                <code>{props.children}</code>
            </pre>
        )
    }

    const DefaultElement = (props: RenderElementProps) => {
        return <p {...props.attributes}>{props.children}</p>
    }


    // Make a Custom Editor
    // Define our own custom set of helpers.
    const CustomEditor = {
        isBoldMarkActive(editor: BaseEditor & ReactEditor) {
            const [match] = Editor.nodes(editor, {
                match: n => n.bold === true,
                universal: true,
            })

            return !!match
        },

        isCodeBlockActive(editor: BaseEditor & ReactEditor) {
            const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
            })

            return !!match
        },
        isItalicMarkActive(editor: BaseEditor & ReactEditor) {
            const [match] = Editor.nodes(editor, {
                match: (n) => {

                    console.log(n)
                    return n.italic === 'code'
                },
            })


            return !!match
        },

        toggleBoldMark(editor: BaseEditor & ReactEditor) {
            const isActive = CustomEditor.isBoldMarkActive(editor)
            Transforms.setNodes(
                editor,
                { bold: isActive ? null : true },
                { match: n => Text.isText(n), split: true }
            )
        },

        toggleCodeBlock(editor: BaseEditor & ReactEditor) {
            const isActive = CustomEditor.isCodeBlockActive(editor)
            Transforms.setNodes(
                editor,
                { type: isActive ? null : 'code' },
                { match: n => Editor.isBlock(editor, n) }
            )
        },
        toggleItalicMark(editor: BaseEditor & ReactEditor) {

            const isActive = CustomEditor.isItalicMarkActive(editor)
            Transforms.setNodes(
                editor,
                { italic: isActive ? null : true },
                { match: n => Text.isText(n), split: true }
            )
        },
    }
    const makeBold = () => {
        CustomEditor.toggleBoldMark(editor)
    }
    const makeItalic = () => {
        CustomEditor.toggleItalicMark(editor)
    }
    const renderElement = useCallback((props: any) => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])
    const renderLeaf = useCallback((props: any) => {
        return <Leaf {...props} />
    }, [])
    return (
        <div className='w-screen  flex justify-center items-center h-screen bg-blue-500'>

            <div className='w-[45%] h-[80%] bg-white rounded-md overflow-hidden p-2'>
                <div className=' toolbar w-full flex items-center gap-2 h-[50px] border  '>
                    <div onClick={makeBold} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>B</div>
                    <div onClick={makeItalic} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>I</div>
                    <div className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>H1</div>
                    <div className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>H2</div>
                    <div className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>Table</div>
                    <div className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>Image</div>
                </div>
                <div className='h-[calc(100%-50px)] overflow-y-auto border border-black'>
                    <Slate editor={editor} value={initialValue} >
                        <Editable
                            renderElement={renderElement}
                            renderLeaf={renderLeaf} />
                    </Slate>
                </div>
            </div>



        </div>
    )
}

export default Index