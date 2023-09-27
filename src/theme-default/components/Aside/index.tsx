import { Header, PropsWithIsland } from 'shared/types';
import { useRef } from 'react';
import { useHeaders } from '../../logic/useHeaders';
import useWindowType from '../../logic/useWindowType';

interface AsideProps {
  headers: Header[];
}

export function Aside(props: AsideProps & PropsWithIsland) {
  const { headers: rawHeaders = [] } = props;
  const headers = useHeaders(rawHeaders);
  // 是否展示大纲栏
  const hasOutline = headers.length > 0 && useWindowType() !== 'mobile';
  // 当前标题会进行高亮处理，我们会在这个标题前面加一个 marker 元素
  const markerRef = useRef<HTMLDivElement>(null);

  const renderHeader = (header: Header, index: number) => {
    return (
      <li key={`${header.id}${index}`}>
        <a
          href={`#${header.id}`}
          className="block leading-7 text-base hover:text-[var(--feather-c-theme-1)]"
        >
          {header.text}
        </a>
      </li>
    );
  };

  return (
    <div
      flex="~ col 1"
      style={{
        width: 'var(--feather-aside-width)'
      }}
    >
      <div>
        {hasOutline && (
          <div
            id="aside-container"
            className="fixed divider-left pl-4 text-lg font-medium"
          >
            <div
              ref={markerRef}
              id="aside-marker"
              className="absolute opacity-0 w-1px bg-[var(--feather-c-theme-1)]"
            ></div>
            <div
              text="lg"
              font="semibold"
              className="text-[var(--feather-c-theme-1)]"
            >
              ON THIS PAGE
            </div>
            <nav>
              <ul relative="~">{headers.map(renderHeader)}</ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
