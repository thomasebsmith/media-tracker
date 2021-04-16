(function(global) {
  const columns = [
    {
      name: "Type",
      key: "type",
    },
    {
      name: "Title",
      key: "title",
    },
    {
      name: "Creators",
      key: "creators",
    },
  ];

  global.data = {
    columns,
  };
  
  loadComplete("data");
})(window);
