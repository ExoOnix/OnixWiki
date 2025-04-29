import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import EditorJS from '@editorjs/editorjs';

// Extensions
import Header from '@editorjs/header';
import List from '@editorjs/list'
import Delimiter from '@editorjs/delimiter';
import ColorPicker from 'editorjs-color-picker';
import ImageTool from '@editorjs/image';

export default function Editor({ value, onChange }) {
    const editorRef = useRef(null);
    const ejInstance = useRef(null);
    const { props } = usePage();
    useEffect(() => {
        if (!ejInstance.current) {
            ejInstance.current = new EditorJS({
                holder: editorRef.current,
                autofocus: true,
                tools: {
                    header: Header,
                    list: List,
                    delimiter: Delimiter,
                    ColorPicker: {
                        class: ColorPicker,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: 'http://localhost/editor/image-file-upload',
                                byUrl: 'http://localhost/editor/image-url-upload',
                            },
                            additionalRequestHeaders: {
                                "X-CSRF-TOKEN": props.csrf,
                            },
                            features: {
                                border: false,
                                stretch: false,
                                background: false,
                                caption: false,
                            }
                        }
                    },
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
