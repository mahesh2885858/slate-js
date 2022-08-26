import React, { useState, useCallback, useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact, } from 'slate-react'
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
    const editor = useMemo(() => withReact(withHistory(createEditor())), []);
    const [value, setValue] = useState<Descendant[]>([
        {
            type: 'paragraph',

            children: [{ text: 'This is my paragraph!' }]
        }
    ])

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




    const DefaultElement = (props: RenderElementProps) => {

        return <p {...props.attributes}>{props.children}</p>
    }


    const CustomEditor = {
        isBoldMarkActive(editor: BaseEditor & ReactEditor) {

            const [match] = Editor.nodes(editor, {
                match: (n) => {
                    return n.bold === true
                },
                universal: true,
            })

            return !!match
        },




        toggleBoldMark(editor: BaseEditor & ReactEditor) {

            const isActive = CustomEditor.isBoldMarkActive(editor)

            Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "mahesh inserted the test here" }] })
        },




    }
    const makeBold = () => {
        CustomEditor.toggleBoldMark(editor)
    }

    const renderElement = useCallback((props: any) => {
        switch (props.element.type) {
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
                    <div onMouseDown={makeBold} className='bg-blue-300 p-1 font-bold px-4 cursor-pointer hover:bg-blue-500 '>Test</div>

                </div>
                <div className='h-[calc(100%-50px)] overflow-y-auto border border-black'>
                    <Slate editor={editor} value={value} onChange={(val) => {
                        console.log(val)
                    }} >
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