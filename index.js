// idea - could check if left or right aligned based on
// the frequency of characters on far left or far right of identified range

function split_lines(text) {
  return text.split(/\n\r?/g);
}

function count_spaces_per_column (lines) {
  const counts = new Array(lines[0].length).fill(0);
  lines.forEach(function (line) {
    Array.from(line).forEach(function (chr, col) {
      if (chr === " ") {
        counts[col]++
      }
    });
  });
  return counts;
}

function convert_counts_to_percentages (counts, total) {
  return counts.map(ct => ct/total);
} 

function identify_gutters(percentages) {
  return percentages.map(p => p === 1);
}

function identify_data_ranges(gutters) {
  const ranges = [];
  let current = null;
  for (let i = 0; i < gutters.length; i++) {
    const is_gutter = gutters[i];
    if (i === 0) {
      if (is_gutter === true) {
        continue;
      } else if (is_gutter === false) {
        current = [0, 0];
      }
    } else if (is_gutter) {
      if (current) {
        ranges.push(current);
        current = null;
      }
    } else {
      // not a gutter
      if (current) {
        // not first character and not gutter, so continue getting data
        current[1]++;        
      } else {
        // exiting gutter
        current = [i, i];
      }
    }
  }
  if (current) {
    ranges.push(current)
  }
  return ranges;
}

function parse_substrings(text, ranges, options) {
  return ranges.map(function (range) {
    let start = range[0];
    let end = range[1];
    if (typeof options === "object" && options.inclusive) end++;
    let result = text.substring(start, end);
    if (typeof options === "object" && options.trim) result = result.trim();
    return result;
  });
}

function parse_row(text, ranges) {
  return parse_substrings(text, ranges, { inclusive: true, trim: true });
}

function lines_to_rows(lines, ranges) {
  return lines.map(line => parse_row(line, ranges));
}

function parse(text) {
  text = text.replace(/^\n/, "");

  const lines = split_lines(text);

  const counts = count_spaces_per_column(lines);

  const percentages = convert_counts_to_percentages(counts, lines.length);

  const gutters = identify_gutters(percentages);

  const ranges = identify_data_ranges(gutters);

  const rows = lines_to_rows(lines, ranges);

  return rows;
}

if (typeof window === "object") {
  window.text_report_parser = {
    "parse": parse
  };
}

if (typeof module === "object") {
  module.exports = {
    split_lines,
    count_spaces_per_column,
    convert_counts_to_percentages,
    identify_gutters,
    identify_data_ranges,
    parse_substrings,
    parse_row,
    lines_to_rows,
    parse
  };  
}
