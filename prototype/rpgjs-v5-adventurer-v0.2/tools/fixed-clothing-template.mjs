/** Shared original-body protection; coordinates are traced once, never per item. */
export const clothingLayout = {
  splitY: 543,
  protectedPaths: [
    {name: 'neck', path: 'M 603 543 L 647 543 L 647 557 L 603 557 Z'},
    {name: 'left-arm-hand', path: 'M 462 697 L 510 713 L 507 745 L 487 791 L 477 820 L 490 857 L 481 893 L 464 921 L 427 921 L 397 897 L 397 846 L 419 785 L 439 736 Z'},
    {name: 'right-arm-hand', path: 'M 741 713 L 789 697 L 810 736 L 831 786 L 854 846 L 854 897 L 824 921 L 787 921 L 770 893 L 761 857 L 774 820 L 763 791 L 744 745 Z'},
    {name: 'left-knee', path: 'M 507 962 L 586 966 L 570 1017 L 564 1059 L 492 1068 L 492 1019 Z'},
    {name: 'right-knee', path: 'M 664 966 L 743 962 L 758 1019 L 758 1068 L 686 1059 L 680 1017 Z'}
  ],
  // Independent fixtures within the exposed parts, for rendered-pixel checks.
  protectedRects: [
    {name: 'neck', rect: [610, 544, 28, 10]},
    {name: 'left-forearm', rect: [454, 744, 23, 34]},
    {name: 'left-hand', rect: [427, 848, 34, 37]},
    {name: 'right-forearm', rect: [775, 744, 23, 34]},
    {name: 'right-hand', rect: [789, 848, 34, 37]},
    {name: 'left-knee', rect: [521, 995, 32, 41]},
    {name: 'right-knee', rect: [697, 995, 32, 41]}
  ],
  footColumns: [[430, 590], [660, 825]],
  maxSoleDrift: 2
};
