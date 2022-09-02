import React from "react";

export function useFilter(data, option) {
  const filteredPosts = React.useRef([])

  filteredPosts.current = React.useMemo(() => {
    if (!option) return data;
    if (data.length) return data.filter((user) => user.userLogin.toLowerCase().includes(option.toLowerCase()))
  }, [data, option])

  return filteredPosts.current
}