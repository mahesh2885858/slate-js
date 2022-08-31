
import React, { useMemo } from 'react'
import { Slate, withReact, Editable, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'
import { BaseEditor, createEditor, Descendant, Editor, Transforms, Text, Element, Range } from 'slate'
import { withHistory } from 'slate-history'
type ElementType = "paragraph" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "link" | "image" | "table"
type CustomElement = { type: ElementType, children: CustomText[] }
type CustomText = { [key: string]: string | boolean }

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}
const Index = () => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const RenderElement = (props: RenderElementProps) => {
        const { attributes, children, element } = props
        switch (element.type) {
            case "paragraph":

                return <p {...attributes} >{children}</p>
            case "h1":
                return <h1 {...attributes} className="text-3xl font-bold">{children}</h1>
            default:
                break;
        }
        return <h1 {...props.attributes}>{props.children}</h1>
    }
    const RenderLeaf = (props: RenderLeafProps) => {
        let { attributes, children, leaf, text } = props
        if (leaf.red) {
            children = <span className='text-red-500'>{children}</span>
        }
        return <span {...props}>{children}</span>
    }
    return (
        <Slate editor={editor} value={[{ type: "paragraph", children: [{ text: "test" }, { text: "test2", red: true }] }, { type: "h1", children: [{ text: "mahesh" }] }]}>
            <Editable
                renderElement={RenderElement}
                renderLeaf={RenderLeaf}
                autoFocus

            />

        </Slate>
    )
}

export default Index