import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list'

export default function Editor({ value, onChange }) {
    const editorRef = useRef(null);
    const ejInstance = useRef(null);

    useEffect(() => {
        if (!ejInstance.current) {
            ejInstance.current = new EditorJS({
                holder: editorRef.current,
                autofocus: true,
                tools: {
                    header: Header,
                    list: List,
                },
                data: value ? JSON.parse(value) : {},
                onReady: () => {
                    console.log('Editor.js is ready to work!');
                },
                onChange: async () => {
                    const content = await ejInstance.current.save();
                    onChange(JSON.stringify(content));
                },
            });
        }

        return () => {
            if (ejInstance.current) {
                ejInstance.current.destroy();
                ejInstance.current = null;
            }
        };
    }, []);

    return <div id="editorjs" ref={editorRef} className="w-full" />;
}
