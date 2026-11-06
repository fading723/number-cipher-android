// Generated deterministically by scripts/generate-levels.mjs.
// All 30 boards are exhaustively checked for a unique solution.
export const LEVELS = [
  {
    "id": 1,
    "title": "一张卡，一个位置",
    "tier": "tutorial",
    "size": 2,
    "digits": [
      1,
      2,
      3,
      4
    ],
    "solution": [
      1,
      3,
      4,
      2
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1
        ],
        "target": 4,
        "label": "第1行的和 = 4"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          2
        ],
        "target": 5,
        "label": "第1列的和 = 5"
      },
      {
        "id": "cross-diagonal",
        "kind": "difference",
        "cells": [
          0,
          3
        ],
        "target": 1,
        "label": "主对角两格的差 = 1"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          3
        ],
        "target": 6,
        "label": "第2列的积 = 6"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第2列的积 = 6。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          1,
          3
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "主对角两格的差 = 1。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "主对角两格的差 = 1。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 4。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "交叉检查",
    "tier": "tutorial",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "solution": [
      2,
      5,
      3,
      6,
      1,
      4
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 10,
        "label": "第1行的和 = 10"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3
        ],
        "target": 12,
        "label": "第1列的积 = 12"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4
        ],
        "target": 6,
        "label": "第2列的和 = 6"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5
        ],
        "target": 7,
        "label": "第3列的和 = 7"
      },
      {
        "id": "cross-pair",
        "kind": "difference",
        "cells": [
          0,
          1
        ],
        "target": 3,
        "label": "上排左侧两格的差 = 3"
      },
      {
        "id": "cross-end-product",
        "kind": "product",
        "cells": [
          0,
          2
        ],
        "target": 6,
        "label": "上排两端的积 = 6"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 12。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "上排左侧两格的差 = 3。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          1
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "上排左侧两格的差 = 3。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          1
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 10。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "差与倍数",
    "tier": "tutorial",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "solution": [
      4,
      1,
      6,
      2,
      5,
      3
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 24,
        "label": "第1行的积 = 24"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 10,
        "label": "第2行的和 = 10"
      },
      {
        "id": "col-0",
        "kind": "ratio",
        "cells": [
          0,
          3
        ],
        "target": 2,
        "label": "第1列：大数 ÷ 小数 = 2"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4
        ],
        "target": 6,
        "label": "第2列的和 = 6"
      },
      {
        "id": "col-2",
        "kind": "difference",
        "cells": [
          2,
          5
        ],
        "target": 3,
        "label": "第3列的差 = 3"
      },
      {
        "id": "cross-diagonal",
        "kind": "sum",
        "cells": [
          0,
          4
        ],
        "target": 9,
        "label": "斜向两格的和 = 9"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 24。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "把数字配成对",
        "text": "第1列：大数 ÷ 小数 = 2。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "斜向两格的和 = 9。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          4
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第2行的和 = 10。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "交叉相遇",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      2,
      8,
      5,
      9,
      3,
      1,
      4,
      6,
      7
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 15,
        "label": "第1行的和 = 15"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 13,
        "label": "第2行的和 = 13"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 17,
        "label": "第3行的和 = 17"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 72,
        "label": "第1列的积 = 72"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 144,
        "label": "第2列的积 = 144"
      },
      {
        "id": "col-2",
        "kind": "product",
        "cells": [
          2,
          5,
          8
        ],
        "target": 35,
        "label": "第3列的积 = 35"
      },
      {
        "id": "cross-diagonal",
        "kind": "sum",
        "cells": [
          0,
          4,
          8
        ],
        "target": 12,
        "label": "主对角线的和 = 12"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 72。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "主对角线的和 = 12。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          4,
          8
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 15。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "因数的秘密",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      1,
      3,
      6,
      4,
      7,
      2,
      9,
      8,
      5
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 18,
        "label": "第1行的积 = 18"
      },
      {
        "id": "row-1",
        "kind": "product",
        "cells": [
          3,
          4,
          5
        ],
        "target": 56,
        "label": "第2行的积 = 56"
      },
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 360,
        "label": "第3行的积 = 360"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 14,
        "label": "第1列的和 = 14"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 18,
        "label": "第2列的和 = 18"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 13,
        "label": "第3列的和 = 13"
      },
      {
        "id": "cross-difference-4-5",
        "kind": "difference",
        "cells": [
          4,
          5
        ],
        "target": 5,
        "label": "B2 与 B3的差 = 5"
      },
      {
        "id": "cross-difference-3-5",
        "kind": "difference",
        "cells": [
          3,
          5
        ],
        "target": 2,
        "label": "B1 与 B3的差 = 2"
      },
      {
        "id": "cross-difference-3-7",
        "kind": "difference",
        "cells": [
          3,
          7
        ],
        "target": 4,
        "label": "B1 与 C2的差 = 4"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 18。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "B2 与 B3的差 = 5。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          4,
          5
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "B2 与 B3的差 = 5。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          4,
          5
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1列的和 = 14。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          3,
          6
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "横竖之间",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      2,
      9,
      6,
      4,
      8,
      1,
      5,
      7,
      3
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 17,
        "label": "第1行的和 = 17"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 13,
        "label": "第2行的和 = 13"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 15,
        "label": "第3行的和 = 15"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 40,
        "label": "第1列的积 = 40"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 504,
        "label": "第2列的积 = 504"
      },
      {
        "id": "col-2",
        "kind": "product",
        "cells": [
          2,
          5,
          8
        ],
        "target": 18,
        "label": "第3列的积 = 18"
      },
      {
        "id": "cross-ratio-0-3",
        "kind": "ratio",
        "cells": [
          0,
          3
        ],
        "target": 2,
        "label": "A1 与 B1：大数 ÷ 小数 = 2"
      },
      {
        "id": "cross-sum-13",
        "kind": "sum",
        "cells": [
          2,
          4,
          7
        ],
        "target": 21,
        "label": "A3、B2、C2的和 = 21"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 40。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "把数字配成对",
        "text": "A1 与 B1：大数 ÷ 小数 = 2。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A1 与 B1：大数 ÷ 小数 = 2。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 17。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 7,
    "title": "换个角度",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      5,
      6,
      1,
      4,
      7,
      9,
      8,
      2,
      3
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 30,
        "label": "第1行的积 = 30"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 20,
        "label": "第2行的和 = 20"
      },
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 48,
        "label": "第3行的积 = 48"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 17,
        "label": "第1列的和 = 17"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 84,
        "label": "第2列的积 = 84"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 13,
        "label": "第3列的和 = 13"
      },
      {
        "id": "cross-difference-1-6",
        "kind": "difference",
        "cells": [
          1,
          6
        ],
        "target": 2,
        "label": "A2 与 C1的差 = 2"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 30。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A2 与 C1的差 = 2。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          1,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A2 与 C1的差 = 2。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          6
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第2行的和 = 20。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "id": 8,
    "title": "奇偶线索",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      4,
      2,
      3,
      1,
      9,
      6,
      7,
      5,
      8
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 9,
        "label": "第1行的和 = 9"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 16,
        "label": "第2行的和 = 16"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 20,
        "label": "第3行的和 = 20"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 12,
        "label": "第1列的和 = 12"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 16,
        "label": "第2列的和 = 16"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 17,
        "label": "第3列的和 = 17"
      },
      {
        "id": "cross-difference-5-7",
        "kind": "difference",
        "cells": [
          5,
          7
        ],
        "target": 1,
        "label": "B3 与 C2的差 = 1"
      },
      {
        "id": "cross-sum-8",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 16,
        "label": "中间竖线的和 = 16"
      },
      {
        "id": "cross-product-11",
        "kind": "product",
        "cells": [
          1,
          5,
          6
        ],
        "target": 84,
        "label": "A2、B3、C1的积 = 84"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "A2、B3、C1的积 = 84。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          1,
          5,
          6
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "B3 与 C2的差 = 1。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          5,
          7
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "B3 与 C2的差 = 1。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          5,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 9。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 9,
    "title": "环环相扣",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      4,
      8,
      3,
      7,
      1,
      9,
      6,
      5,
      2
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 15,
        "label": "第1行的和 = 15"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 17,
        "label": "第2行的和 = 17"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 13,
        "label": "第3行的和 = 13"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 168,
        "label": "第1列的积 = 168"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 40,
        "label": "第2列的积 = 40"
      },
      {
        "id": "cross-difference-0-7",
        "kind": "difference",
        "cells": [
          0,
          7
        ],
        "target": 1,
        "label": "A1 与 C2的差 = 1"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 168。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A1 与 C2的差 = 1。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          7
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A1 与 C2的差 = 1。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 15。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 10,
    "title": "乘法密码",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      6,
      9,
      8,
      3,
      1,
      5,
      2,
      7,
      4
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 23,
        "label": "第1行的和 = 23"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 9,
        "label": "第2行的和 = 9"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 13,
        "label": "第3行的和 = 13"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 36,
        "label": "第1列的积 = 36"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 63,
        "label": "第2列的积 = 63"
      },
      {
        "id": "col-2",
        "kind": "product",
        "cells": [
          2,
          5,
          8
        ],
        "target": 160,
        "label": "第3列的积 = 160"
      },
      {
        "id": "cross-ratio-2-4",
        "kind": "ratio",
        "cells": [
          2,
          4
        ],
        "target": 8,
        "label": "A3 与 B2：大数 ÷ 小数 = 8"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 36。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "把数字配成对",
        "text": "A3 与 B2：大数 ÷ 小数 = 8。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          2,
          4
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A3 与 B2：大数 ÷ 小数 = 8。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          2,
          4
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 23。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 11,
    "title": "角落里的提示",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      8,
      5,
      7,
      1,
      2,
      9,
      6,
      4,
      3
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 280,
        "label": "第1行的积 = 280"
      },
      {
        "id": "row-1",
        "kind": "product",
        "cells": [
          3,
          4,
          5
        ],
        "target": 18,
        "label": "第2行的积 = 18"
      },
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 72,
        "label": "第3行的积 = 72"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 15,
        "label": "第1列的和 = 15"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 11,
        "label": "第2列的和 = 11"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 19,
        "label": "第3列的和 = 19"
      },
      {
        "id": "cross-sum-0",
        "kind": "sum",
        "cells": [
          0,
          4,
          8
        ],
        "target": 13,
        "label": "主对角线的和 = 13"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 280。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "主对角线的和 = 13。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          4,
          8
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1列的和 = 15。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          3,
          6
        ]
      }
    ]
  },
  {
    "id": 12,
    "title": "两条路",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      6,
      4,
      8,
      3,
      2,
      7,
      1,
      9,
      5
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 18,
        "label": "第1行的和 = 18"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 12,
        "label": "第2行的和 = 12"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 15,
        "label": "第3行的和 = 15"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 18,
        "label": "第1列的积 = 18"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 72,
        "label": "第2列的积 = 72"
      },
      {
        "id": "col-2",
        "kind": "product",
        "cells": [
          2,
          5,
          8
        ],
        "target": 280,
        "label": "第3列的积 = 280"
      },
      {
        "id": "cross-ratio-1-2",
        "kind": "ratio",
        "cells": [
          1,
          2
        ],
        "target": 2,
        "label": "A2 与 A3：大数 ÷ 小数 = 2"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 18。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "把数字配成对",
        "text": "A2 与 A3：大数 ÷ 小数 = 2。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          1,
          2
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A2 与 A3：大数 ÷ 小数 = 2。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          2
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 18。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 13,
    "title": "交点突破",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      6,
      1,
      2,
      3,
      7,
      4,
      5,
      8,
      9
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 12,
        "label": "第1行的积 = 12"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 14,
        "label": "第2行的和 = 14"
      },
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 360,
        "label": "第3行的积 = 360"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 14,
        "label": "第1列的和 = 14"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 56,
        "label": "第2列的积 = 56"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 15,
        "label": "第3列的和 = 15"
      },
      {
        "id": "cross-ratio-1-6",
        "kind": "ratio",
        "cells": [
          1,
          6
        ],
        "target": 5,
        "label": "A2 与 C1：大数 ÷ 小数 = 5"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 12。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "把数字配成对",
        "text": "A2 与 C1：大数 ÷ 小数 = 5。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          1,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A2 与 C1：大数 ÷ 小数 = 5。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          6
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第2行的和 = 14。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "id": 14,
    "title": "数字的边界",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      9,
      5,
      6,
      4,
      7,
      1,
      8,
      3,
      2
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 20,
        "label": "第1行的和 = 20"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 12,
        "label": "第2行的和 = 12"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 13,
        "label": "第3行的和 = 13"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 21,
        "label": "第1列的和 = 21"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 15,
        "label": "第2列的和 = 15"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 9,
        "label": "第3列的和 = 9"
      },
      {
        "id": "cross-difference-0-1",
        "kind": "difference",
        "cells": [
          0,
          1
        ],
        "target": 4,
        "label": "A1 与 A2的差 = 4"
      },
      {
        "id": "cross-difference-0-3",
        "kind": "difference",
        "cells": [
          0,
          3
        ],
        "target": 5,
        "label": "A1 与 B1的差 = 5"
      }
    ],
    "hints": [
      {
        "title": "用差值缩小范围",
        "text": "A1 与 A2的差 = 4。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          1
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A1 与 A2的差 = 4。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          1
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 20。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 15,
    "title": "大小之间",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      5,
      9,
      3,
      2,
      8,
      7,
      4,
      6,
      1
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 17,
        "label": "第1行的和 = 17"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 17,
        "label": "第2行的和 = 17"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 11,
        "label": "第3行的和 = 11"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 40,
        "label": "第1列的积 = 40"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 432,
        "label": "第2列的积 = 432"
      },
      {
        "id": "cross-ratio-3-6",
        "kind": "ratio",
        "cells": [
          3,
          6
        ],
        "target": 2,
        "label": "B1 与 C1：大数 ÷ 小数 = 2"
      },
      {
        "id": "cross-sum-5",
        "kind": "sum",
        "cells": [
          1,
          2,
          4,
          5
        ],
        "target": 27,
        "label": "右上四格的和 = 27"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 40。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "把数字配成对",
        "text": "B1 与 C1：大数 ÷ 小数 = 2。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          3,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "B1 与 C1：大数 ÷ 小数 = 2。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          3,
          6
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 17。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 16,
    "title": "排除之后",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      5,
      2,
      7,
      3,
      9,
      6,
      4,
      1,
      8
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 14,
        "label": "第1行的和 = 14"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 18,
        "label": "第2行的和 = 18"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 13,
        "label": "第3行的和 = 13"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 60,
        "label": "第1列的积 = 60"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 18,
        "label": "第2列的积 = 18"
      },
      {
        "id": "col-2",
        "kind": "product",
        "cells": [
          2,
          5,
          8
        ],
        "target": 336,
        "label": "第3列的积 = 336"
      },
      {
        "id": "cross-ratio-4-7",
        "kind": "ratio",
        "cells": [
          4,
          7
        ],
        "target": 9,
        "label": "B2 与 C2：大数 ÷ 小数 = 9"
      },
      {
        "id": "cross-product-8",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 18,
        "label": "中间竖线的积 = 18"
      },
      {
        "id": "cross-difference-1-8",
        "kind": "difference",
        "cells": [
          1,
          8
        ],
        "target": 6,
        "label": "A2 与 C3的差 = 6"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 60。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "把数字配成对",
        "text": "B2 与 C2：大数 ÷ 小数 = 9。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          4,
          7
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "B2 与 C2：大数 ÷ 小数 = 9。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          4,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 14。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 17,
    "title": "藏在中间",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      1,
      7,
      6,
      8,
      2,
      9,
      3,
      5,
      4
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 42,
        "label": "第1行的积 = 42"
      },
      {
        "id": "row-1",
        "kind": "product",
        "cells": [
          3,
          4,
          5
        ],
        "target": 144,
        "label": "第2行的积 = 144"
      },
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 60,
        "label": "第3行的积 = 60"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 12,
        "label": "第1列的和 = 12"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 14,
        "label": "第2列的和 = 14"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 19,
        "label": "第3列的和 = 19"
      },
      {
        "id": "cross-product-13",
        "kind": "product",
        "cells": [
          2,
          4,
          7
        ],
        "target": 60,
        "label": "A3、B2、C2的积 = 60"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 42。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A3、B2、C2的积 = 60。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          2,
          4,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1列的和 = 12。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          3,
          6
        ]
      }
    ]
  },
  {
    "id": 18,
    "title": "重新排列",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      1,
      8,
      5,
      4,
      7,
      6,
      9,
      3,
      2
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 14,
        "label": "第1行的和 = 14"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 17,
        "label": "第2行的和 = 17"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 14,
        "label": "第3行的和 = 14"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 36,
        "label": "第1列的积 = 36"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 168,
        "label": "第2列的积 = 168"
      },
      {
        "id": "col-2",
        "kind": "product",
        "cells": [
          2,
          5,
          8
        ],
        "target": 60,
        "label": "第3列的积 = 60"
      },
      {
        "id": "cross-sum-3",
        "kind": "sum",
        "cells": [
          1,
          3,
          5,
          7
        ],
        "target": 21,
        "label": "四个边心的和 = 21"
      },
      {
        "id": "cross-difference-0-4",
        "kind": "difference",
        "cells": [
          0,
          4
        ],
        "target": 6,
        "label": "A1 与 B2的差 = 6"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 36。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A1 与 B2的差 = 6。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          4
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "四个边心的和 = 21。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          3,
          5,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 14。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 19,
    "title": "连锁推理",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      5,
      8,
      3,
      1,
      9,
      6,
      2,
      7,
      4
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 120,
        "label": "第1行的积 = 120"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 16,
        "label": "第2行的和 = 16"
      },
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 56,
        "label": "第3行的积 = 56"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 8,
        "label": "第1列的和 = 8"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 504,
        "label": "第2列的积 = 504"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 13,
        "label": "第3列的和 = 13"
      },
      {
        "id": "cross-sum-14",
        "kind": "sum",
        "cells": [
          1,
          3,
          8
        ],
        "target": 13,
        "label": "A2、B1、C3的和 = 13"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 120。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A2、B1、C3的和 = 13。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          3,
          8
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第2行的和 = 16。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "id": 20,
    "title": "逆向思考",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      9,
      5,
      7,
      2,
      4,
      8,
      6,
      1,
      3
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 21,
        "label": "第1行的和 = 21"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 14,
        "label": "第2行的和 = 14"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 10,
        "label": "第3行的和 = 10"
      },
      {
        "id": "col-0",
        "kind": "sum",
        "cells": [
          0,
          3,
          6
        ],
        "target": 17,
        "label": "第1列的和 = 17"
      },
      {
        "id": "col-1",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 10,
        "label": "第2列的和 = 10"
      },
      {
        "id": "col-2",
        "kind": "sum",
        "cells": [
          2,
          5,
          8
        ],
        "target": 18,
        "label": "第3列的和 = 18"
      },
      {
        "id": "cross-difference-2-6",
        "kind": "difference",
        "cells": [
          2,
          6
        ],
        "target": 1,
        "label": "A3 与 C1的差 = 1"
      },
      {
        "id": "cross-sum-6",
        "kind": "sum",
        "cells": [
          3,
          4,
          6,
          7
        ],
        "target": 13,
        "label": "左下四格的和 = 13"
      }
    ],
    "hints": [
      {
        "title": "用差值缩小范围",
        "text": "A3 与 C1的差 = 1。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          2,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "A3 与 C1的差 = 1。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          2,
          6
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 21。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 21,
    "title": "数阵之钥",
    "tier": "normal",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      6,
      3,
      5,
      9,
      8,
      1,
      4,
      2,
      7
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 14,
        "label": "第1行的和 = 14"
      },
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 18,
        "label": "第2行的和 = 18"
      },
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 13,
        "label": "第3行的和 = 13"
      },
      {
        "id": "col-0",
        "kind": "product",
        "cells": [
          0,
          3,
          6
        ],
        "target": 216,
        "label": "第1列的积 = 216"
      },
      {
        "id": "col-1",
        "kind": "product",
        "cells": [
          1,
          4,
          7
        ],
        "target": 48,
        "label": "第2列的积 = 48"
      },
      {
        "id": "cross-difference-3-7",
        "kind": "difference",
        "cells": [
          3,
          7
        ],
        "target": 7,
        "label": "B1 与 C2的差 = 7"
      },
      {
        "id": "cross-product-12",
        "kind": "product",
        "cells": [
          0,
          5,
          7
        ],
        "target": 12,
        "label": "A1、B3、C2的积 = 12"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1列的积 = 216。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          3,
          6
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "B1 与 C2的差 = 7。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          3,
          7
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "B1 与 C2的差 = 7。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          3,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 14。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 22,
    "title": "斜线谜团",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      4,
      6,
      3,
      9,
      1,
      5,
      8,
      7,
      2
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 72,
        "label": "第1行的积 = 72"
      },
      {
        "id": "cross-anchor-0",
        "kind": "sum",
        "cells": [
          0,
          4,
          8
        ],
        "target": 7,
        "label": "主对角线的和 = 7"
      },
      {
        "id": "cross-difference-1-6",
        "kind": "difference",
        "cells": [
          1,
          6
        ],
        "target": 2,
        "label": "A2 与 C1的差 = 2"
      },
      {
        "id": "cross-sum-13",
        "kind": "sum",
        "cells": [
          2,
          4,
          7
        ],
        "target": 11,
        "label": "A3、B2、C2的和 = 11"
      },
      {
        "id": "cross-sum-5",
        "kind": "sum",
        "cells": [
          1,
          2,
          4,
          5
        ],
        "target": 15,
        "label": "右上四格的和 = 15"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 72。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A2 与 C1的差 = 2。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          1,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "主对角线的和 = 7。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          4,
          8
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "主对角线的和 = 7。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          4,
          8
        ]
      }
    ]
  },
  {
    "id": 23,
    "title": "四角围合",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      8,
      1,
      2,
      7,
      9,
      4,
      5,
      3,
      6
    ],
    "constraints": [
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 20,
        "label": "第2行的和 = 20"
      },
      {
        "id": "cross-anchor-1",
        "kind": "sum",
        "cells": [
          2,
          4,
          6
        ],
        "target": 16,
        "label": "副对角线的和 = 16"
      },
      {
        "id": "cross-ratio-1-6",
        "kind": "ratio",
        "cells": [
          1,
          6
        ],
        "target": 5,
        "label": "A2 与 C1：大数 ÷ 小数 = 5"
      },
      {
        "id": "cross-sum-0",
        "kind": "sum",
        "cells": [
          0,
          4,
          8
        ],
        "target": 23,
        "label": "主对角线的和 = 23"
      },
      {
        "id": "cross-difference-5-8",
        "kind": "difference",
        "cells": [
          5,
          8
        ],
        "target": 2,
        "label": "B3 与 C3的差 = 2"
      }
    ],
    "hints": [
      {
        "title": "把数字配成对",
        "text": "A2 与 C1：大数 ÷ 小数 = 5。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          1,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "副对角线的和 = 16。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          2,
          4,
          6
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第2行的和 = 20。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "id": 24,
    "title": "中心枢纽",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      2,
      7,
      9,
      6,
      4,
      1,
      8,
      5,
      3
    ],
    "constraints": [
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 120,
        "label": "第3行的积 = 120"
      },
      {
        "id": "cross-anchor-2",
        "kind": "sum",
        "cells": [
          0,
          2,
          6,
          8
        ],
        "target": 22,
        "label": "四个角的和 = 22"
      },
      {
        "id": "cross-difference-3-7",
        "kind": "difference",
        "cells": [
          3,
          7
        ],
        "target": 1,
        "label": "B1 与 C2的差 = 1"
      },
      {
        "id": "cross-difference-1-7",
        "kind": "difference",
        "cells": [
          1,
          7
        ],
        "target": 2,
        "label": "A2 与 C2的差 = 2"
      },
      {
        "id": "cross-sum-0",
        "kind": "sum",
        "cells": [
          0,
          4,
          8
        ],
        "target": 9,
        "label": "主对角线的和 = 9"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第3行的积 = 120。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          6,
          7,
          8
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "B1 与 C2的差 = 1。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          3,
          7
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "四个角的和 = 22。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          2,
          6,
          8
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "四个角的和 = 22。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          2,
          6,
          8
        ]
      }
    ]
  },
  {
    "id": 25,
    "title": "稀疏线索",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      4,
      1,
      6,
      2,
      7,
      3,
      9,
      5,
      8
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "sum",
        "cells": [
          0,
          1,
          2
        ],
        "target": 11,
        "label": "第1行的和 = 11"
      },
      {
        "id": "cross-anchor-3",
        "kind": "sum",
        "cells": [
          1,
          3,
          5,
          7
        ],
        "target": 11,
        "label": "四个边心的和 = 11"
      },
      {
        "id": "cross-ratio-5-6",
        "kind": "ratio",
        "cells": [
          5,
          6
        ],
        "target": 3,
        "label": "B3 与 C1：大数 ÷ 小数 = 3"
      },
      {
        "id": "cross-difference-0-4",
        "kind": "difference",
        "cells": [
          0,
          4
        ],
        "target": 3,
        "label": "A1 与 B2的差 = 3"
      },
      {
        "id": "cross-difference-3-5",
        "kind": "difference",
        "cells": [
          3,
          5
        ],
        "target": 1,
        "label": "B1 与 B3的差 = 1"
      }
    ],
    "hints": [
      {
        "title": "把数字配成对",
        "text": "B3 与 C1：大数 ÷ 小数 = 3。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          5,
          6
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "四个边心的和 = 11。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          3,
          5,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第1行的和 = 11。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          2
        ]
      }
    ]
  },
  {
    "id": 26,
    "title": "分组与配对",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      3,
      6,
      9,
      5,
      7,
      2,
      4,
      8,
      1
    ],
    "constraints": [
      {
        "id": "row-1",
        "kind": "product",
        "cells": [
          3,
          4,
          5
        ],
        "target": 70,
        "label": "第2行的积 = 70"
      },
      {
        "id": "cross-anchor-4",
        "kind": "sum",
        "cells": [
          0,
          1,
          3,
          4
        ],
        "target": 21,
        "label": "左上四格的和 = 21"
      },
      {
        "id": "cross-difference-0-2",
        "kind": "difference",
        "cells": [
          0,
          2
        ],
        "target": 6,
        "label": "A1 与 A3的差 = 6"
      },
      {
        "id": "cross-difference-0-7",
        "kind": "difference",
        "cells": [
          0,
          7
        ],
        "target": 5,
        "label": "A1 与 C2的差 = 5"
      },
      {
        "id": "cross-difference-4-8",
        "kind": "difference",
        "cells": [
          4,
          8
        ],
        "target": 6,
        "label": "B2 与 C3的差 = 6"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第2行的积 = 70。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          3,
          4,
          5
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A1 与 A3的差 = 6。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          2
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "左上四格的和 = 21。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          0,
          1,
          3,
          4
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "左上四格的和 = 21。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          0,
          1,
          3,
          4
        ]
      }
    ]
  },
  {
    "id": 27,
    "title": "无声的对称",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      3,
      4,
      2,
      8,
      9,
      7,
      6,
      1,
      5
    ],
    "constraints": [
      {
        "id": "row-2",
        "kind": "sum",
        "cells": [
          6,
          7,
          8
        ],
        "target": 12,
        "label": "第3行的和 = 12"
      },
      {
        "id": "cross-anchor-5",
        "kind": "sum",
        "cells": [
          1,
          2,
          4,
          5
        ],
        "target": 22,
        "label": "右上四格的和 = 22"
      },
      {
        "id": "cross-difference-1-4",
        "kind": "difference",
        "cells": [
          1,
          4
        ],
        "target": 5,
        "label": "A2 与 B2的差 = 5"
      },
      {
        "id": "cross-difference-5-8",
        "kind": "difference",
        "cells": [
          5,
          8
        ],
        "target": 2,
        "label": "B3 与 C3的差 = 2"
      },
      {
        "id": "cross-sum-12",
        "kind": "sum",
        "cells": [
          0,
          5,
          7
        ],
        "target": 11,
        "label": "A1、B3、C2的和 = 11"
      },
      {
        "id": "cross-sum-14",
        "kind": "sum",
        "cells": [
          1,
          3,
          8
        ],
        "target": 17,
        "label": "A2、B1、C3的和 = 17"
      }
    ],
    "hints": [
      {
        "title": "用差值缩小范围",
        "text": "A2 与 B2的差 = 5。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          1,
          4
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "右上四格的和 = 22。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          2,
          4,
          5
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第3行的和 = 12。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          6,
          7,
          8
        ]
      }
    ]
  },
  {
    "id": 28,
    "title": "交错回路",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      1,
      5,
      8,
      7,
      3,
      6,
      4,
      9,
      2
    ],
    "constraints": [
      {
        "id": "row-0",
        "kind": "product",
        "cells": [
          0,
          1,
          2
        ],
        "target": 40,
        "label": "第1行的积 = 40"
      },
      {
        "id": "cross-anchor-6",
        "kind": "sum",
        "cells": [
          3,
          4,
          6,
          7
        ],
        "target": 23,
        "label": "左下四格的和 = 23"
      },
      {
        "id": "cross-sum-2",
        "kind": "sum",
        "cells": [
          0,
          2,
          6,
          8
        ],
        "target": 15,
        "label": "四个角的和 = 15"
      },
      {
        "id": "cross-difference-0-3",
        "kind": "difference",
        "cells": [
          0,
          3
        ],
        "target": 6,
        "label": "A1 与 B1的差 = 6"
      },
      {
        "id": "cross-difference-6-7",
        "kind": "difference",
        "cells": [
          6,
          7
        ],
        "target": 5,
        "label": "C1 与 C2的差 = 5"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第1行的积 = 40。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          1,
          2
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A1 与 B1的差 = 6。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          0,
          3
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "左下四格的和 = 23。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          3,
          4,
          6,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "左下四格的和 = 23。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          6,
          7
        ]
      }
    ]
  },
  {
    "id": 29,
    "title": "条件之网",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      4,
      5,
      6,
      2,
      3,
      7,
      9,
      8,
      1
    ],
    "constraints": [
      {
        "id": "row-1",
        "kind": "sum",
        "cells": [
          3,
          4,
          5
        ],
        "target": 12,
        "label": "第2行的和 = 12"
      },
      {
        "id": "cross-anchor-7",
        "kind": "sum",
        "cells": [
          4,
          5,
          7,
          8
        ],
        "target": 19,
        "label": "右下四格的和 = 19"
      },
      {
        "id": "cross-ratio-6-8",
        "kind": "ratio",
        "cells": [
          6,
          8
        ],
        "target": 9,
        "label": "C1 与 C3：大数 ÷ 小数 = 9"
      },
      {
        "id": "cross-product-9",
        "kind": "product",
        "cells": [
          0,
          4,
          7
        ],
        "target": 96,
        "label": "A1、B2、C2的积 = 96"
      },
      {
        "id": "cross-difference-2-8",
        "kind": "difference",
        "cells": [
          2,
          8
        ],
        "target": 5,
        "label": "A3 与 C3的差 = 5"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "A1、B2、C2的积 = 96。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          0,
          4,
          7
        ]
      },
      {
        "title": "把数字配成对",
        "text": "C1 与 C3：大数 ÷ 小数 = 9。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          6,
          8
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "右下四格的和 = 19。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          4,
          5,
          7,
          8
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "第2行的和 = 12。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "id": 30,
    "title": "最后的数阵",
    "tier": "challenge",
    "size": 3,
    "digits": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    "solution": [
      9,
      4,
      2,
      5,
      7,
      6,
      8,
      3,
      1
    ],
    "constraints": [
      {
        "id": "row-2",
        "kind": "product",
        "cells": [
          6,
          7,
          8
        ],
        "target": 24,
        "label": "第3行的积 = 24"
      },
      {
        "id": "cross-anchor-8",
        "kind": "sum",
        "cells": [
          1,
          4,
          7
        ],
        "target": 14,
        "label": "中间竖线的和 = 14"
      },
      {
        "id": "cross-difference-2-3",
        "kind": "difference",
        "cells": [
          2,
          3
        ],
        "target": 3,
        "label": "A3 与 B1的差 = 3"
      },
      {
        "id": "cross-product-11",
        "kind": "product",
        "cells": [
          1,
          5,
          6
        ],
        "target": 192,
        "label": "A2、B3、C1的积 = 192"
      },
      {
        "id": "cross-sum-13",
        "kind": "sum",
        "cells": [
          2,
          4,
          7
        ],
        "target": 12,
        "label": "A3、B2、C2的和 = 12"
      },
      {
        "id": "cross-difference-1-8",
        "kind": "difference",
        "cells": [
          1,
          8
        ],
        "target": 3,
        "label": "A2 与 C3的差 = 3"
      }
    ],
    "hints": [
      {
        "title": "从因数开始",
        "text": "第3行的积 = 24。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。",
        "cells": [
          6,
          7,
          8
        ]
      },
      {
        "title": "用差值缩小范围",
        "text": "A3 与 B1的差 = 3。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。",
        "cells": [
          2,
          3
        ]
      },
      {
        "title": "同时看两组格子",
        "text": "中间竖线的和 = 14。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。",
        "cells": [
          1,
          4,
          7
        ]
      },
      {
        "title": "估算范围，再排除",
        "text": "中间竖线的和 = 14。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。",
        "cells": [
          1,
          4,
          7
        ]
      }
    ]
  }
];
