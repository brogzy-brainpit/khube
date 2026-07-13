import { useEffect, useRef, useState } from "react";

export function PaginatedResourceSection({
  connection,
  connectionKey,
  query,
  variables = {},
  pageBy = 20,
  children,
  ariaLabel,
  resourcesClassName,
}) {
  const [nodes, setNodes] = useState(connection.nodes);
  const [pageInfo, setPageInfo] = useState(connection.pageInfo);
  const [loading, setLoading] = useState(false);

  // ids that should animate
  const [animatedIds, setAnimatedIds] = useState(new Set());

  // "next" | "previous"
  const [direction, setDirection] = useState("next");

  // every id we've already rendered
  const renderedIds = useRef(
    new Set(connection.nodes.map((node) => node.id))
  );

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    setNodes(connection.nodes);
    setPageInfo(connection.pageInfo);
  }, [connection]);

  async function paginate(dir) {
    if (loading) return;

    const cursor =
      dir === "next"
        ? pageInfo.endCursor
        : pageInfo.startCursor;

    if (!cursor) return;

    setLoading(true);

    try {
      const paginationVariables =
        dir === "next"
          ? {
              first: pageBy,
              endCursor: cursor,
            }
          : {
              last: pageBy,
              startCursor: cursor,
            };

      const response = await fetch("/api/pagination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            ...variables,
            ...paginationVariables,
          },
        }),
      });

      const data = await response.json();

      const nextConnection = data[connectionKey];

      if (!nextConnection) return;

      // find only the truly new ids
      const newAnimatedIds = new Set();

      nextConnection.nodes.forEach((node) => {
        if (!renderedIds.current.has(node.id)) {
          renderedIds.current.add(node.id);
          newAnimatedIds.add(node.id);
        }
      });

      setAnimatedIds(newAnimatedIds);
      setDirection(dir);

      setNodes((previous) => {
        const merged =
          dir === "next"
            ? [...previous, ...nextConnection.nodes]
            : [...nextConnection.nodes, ...previous];

        const map = new Map();

        merged.forEach((item) => {
          map.set(item.id, item);
        });

        return [...map.values()];
      });

      setPageInfo((prev) => {
        if (dir === "next") {
          return {
            ...prev,
            endCursor: nextConnection.pageInfo.endCursor,
            hasNextPage: nextConnection.pageInfo.hasNextPage,
          };
        }

        return {
          ...prev,
          startCursor: nextConnection.pageInfo.startCursor,
          hasPreviousPage: nextConnection.pageInfo.hasPreviousPage,
        };
      });

      const url = new URL(window.location.href);

      url.searchParams.set("cursor", cursor);
      url.searchParams.set("direction", dir);

      window.history.replaceState({}, "", url.toString());
      // clear animation ids after animation finishes
      // setTimeout(() => {
      //   setAnimatedIds(new Set());
      // }, 900);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  const handlePopState = (event) => {
    if (!event.state) return;
 const url = new URL(window.location.href);

    const cursor = url.searchParams.get("cursor");
    const direction = url.searchParams.get("direction");
    setNodes(event.state.nodes);
    setPageInfo(event.state.pageInfo);
    setAnimatedIds(new Set(event.state.animatedIds));
  };

  window.addEventListener("popstate", handlePopState);

  return () =>
    window.removeEventListener("popstate", handlePopState);
}, []);

  return (
    <div>
      {pageInfo.hasPreviousPage && (
        <button
          disabled={loading}
          onClick={() => paginate("previous")}
        >
          {loading ? "Loading..." : "Load Previous"}
        </button>
      )}

      {resourcesClassName ? (
        <div
          className={resourcesClassName}
          aria-label={ariaLabel}
          role={ariaLabel ? "region" : undefined}
        >
          {nodes.map((node, index) =>
            children({
              node,
              index,
              isNew: animatedIds.has(node.id),
              direction,
            })
          )}
        </div>
      ) : (
        nodes.map((node, index) =>
          children({
            node,
            index,
            isNew: animatedIds.has(node.id),
            direction,
          })
        )
      )}

      {pageInfo.hasNextPage && (
        <button
          disabled={loading}
          onClick={() => paginate("next")}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}