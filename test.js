const test = require("flug");
const {
  split_lines,
  count_spaces_per_column,
  convert_counts_to_percentages,
  identify_gutters,
  identify_data_ranges,
  parse_row,
  lines_to_rows,
  parse
} = require("./index");

const example = `
  123    42       235 
   43    23-       12 
   13    12        53 `.replace(/^\n/, "");

test("basic", ({ eq }) => {
  const lines = split_lines(example);
  eq(lines, ["  123    42       235 ", "   43    23-       12 ", "   13    12        53 "]);

  const counts = count_spaces_per_column(lines);
  eq(counts, [3,3,2,0,0,3,3,3,3,0,0,2,3,3,3,3,3,3,2,0,0,3]);

  const percentages = convert_counts_to_percentages(counts, lines.length);
  eq(percentages, [1,1,0.6666666666666666,0,0,1,1,1,1,0,0,0.6666666666666666,1,1,1,1,1,1,0.6666666666666666,0,0,1]);

  const gutters = identify_gutters(percentages);
  eq(gutters, [true,true,false,false,false,true,true,true,true,false,false,false,true,true,true,true,true,true,false,false,false,true]);

  const ranges = identify_data_ranges(gutters);
  eq(ranges, [[2,4],[9,11],[18,20]]);

  const parsed = parse_row(lines[0], ranges);
  eq(parsed, ["123","42","235"]);

  const rows = lines_to_rows(lines, ranges);
  eq(rows, [["123","42","235"],["43","23-","12"],["13","12","53"]]);

  eq(parse(example), [["123","42","235"],["43","23-","12"],["13","12","53"]]);
});

