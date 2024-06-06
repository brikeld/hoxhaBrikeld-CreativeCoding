const Composition1 = [
  { note: "C1", delay: 0, type: "line" },
  { note: "C1", delay: 2.482, type: "line" },
  { note: "C4", delay: 3.722, type: "icon" },
  { note: "C3", delay: 6.204, type: "text" },
  { note: "C6", delay: 1.241, type: "icon" },
  { note: "C6", delay: 4.963, type: "icon" },
  { note: "C7", delay: 7.445, type: "icon" },
];

const Composition2 = [
  { note: "C2", delay: 2.482, type: "line" },
  { note: "C2", delay: 4.905, type: "icon" },
  { note: "C4", delay: 0, type: "icon" },
  { note: "C4", delay: 2.482, type: "icon" },
  { note: "C7", delay: 0, type: "icon" },                             
  { note: "C7", delay: 2.482, type: "icon" },
  { note: "C7", delay: 7.445, type: "icon" },
  { note: "C8", delay: 7.445, type: "icon" },
  { note: "C2", delay: 0.931, type: "text" },
  { note: "C2", delay: 3.412, type: "text" },
];

const Composition3 = [
  { note: "C1", delay: 0, type: "icon" },
  { note: "C5", delay: 2.482, type: "icon" },
  { note: "C5", delay: 6.514, type: "icon" },
  { note: "C4", delay: 0, type: "text" },
  { note: "C5", delay: 4.963, type: "text" },
  { note: "C6", delay: 8.376, type: "text" },
  { note: "C8", delay: 3.102, type: "icon" },
];

const Composition4 = [
  { note: "C2", delay: 0.465, type: "icon" },
  { note: "C2", delay: 5.584, type: "icon" },
  { note: "C3", delay: 1.241, type: "text" },
  { note: "C3", delay: 7.745, type: "text" },
  { note: "C5", delay: 3.722, type: "text" },
  { note: "C6", delay: 0, type: "text" },
  { note: "C6", delay: 2.482, type: "text" },
  { note: "C6", delay: 4.963, type: "text" },
];

const Composition5 = [





  
];


const compositions = [Composition1, Composition2, Composition3, Composition4];

export { compositions };

/* [COMPOSITION 1]
line: 00, 02.482
t_3: 06.204
i_4: 03.722
i_6: 01.241, 04.963
i_7: 07.445

[COMPOSITION 2]
DottedLine: 02.482
i_2: 04.905
i_4: 0, 02.482
i_7: 0, 02.482, 07.445
i_8: 07.445
t_2: 0.931, 03.412

[COMPOSITION 3]
i_1: 0
i_5: 02.482, 06.514
t_4: 0
t_5: 04.963
t_6: 08.376
i_8: 03.102

[COMPOSITION 4]
i_2: 00.465, 05.584
t_3: 01.241, 07.445
t_5: 03.722
t_6: 0, 02.482, 04.963
 */