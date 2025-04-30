import EditorJS from '@editorjs/editorjs';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

// Extensions
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import ColorPicker from 'editorjs-color-picker';

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
                    header: {
                        class: Header,
                        inlineToolbar: true,
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    delimiter: Delimiter,
                    ColorPicker: {
                        class: ColorPicker,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: '/editor/image-file-upload',
                                byUrl: '/editor/image-url-upload',
                            },
                            additionalRequestHeaders: {
                                'X-CSRF-TOKEN': props.csrf,
                            },
                            features: {
                                border: false,
                                stretch: false,
                                background: false,
                                caption: false,
                            },
                        },
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
