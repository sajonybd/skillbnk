import sys,re
d=sys.argv[1]
M={"GroupsStoryVideo":"groups.txt","ChatBotsStoryVideo":"bots.txt","CalendarStoryVideo":"cal.txt"}
here=sys.argv[2]
for n,h in M.items():
  p=f"{d}/{n}.tsx"; s=open(p).read()
  a=s.index("// ───────── hook"); b=s.index("const PY = {")
  s=s[:a]+open(f"{here}/{h}").read()+s[b:]
  if "./hookKit" not in s:
    s=s.replace('import { makeTL,','import { Person, Stage, BeatCaption, Stamp, Bubble } from "./hookKit";\nimport { makeTL,',1)
  open(p,"w").write(s); print("ok",n)
