---
title: 几个有趣的相对论悖论
tags:
  - 相对论
  - 悖论
  - 有趣
date: 2016-04-15 18:15:57
keywords: 相对论,悖论,佯谬,双生子悖论,孪生子佯谬,洛伦兹冰缝悖论,堵火车悖论,时空图,洛伦兹变换
---

爱因斯坦的相对论自从被提出以来就一直有各种各样看似是悖论的情形被提出，搞清楚这些悖论的解决过程对我们学好相对论是很有帮助的。下面我们就来讨论几个很有代表性的。大家可以先不看我的分析，自己先思考一下。另外如果对我的理解有异议请一定在下面给我留言哦。
## 双生子悖论
这是相对论中最经典的悖论，已经有无数篇关于它的论文发表在各大期刊上了。它大概是这样的：
有甲乙两个兄弟，甲喜欢呆在家里而乙喜欢旅行。一天乙乘坐一艘飞船以接近光速的速度飞往一颗很远的星球然后立即调头返回。甲看来乙一直是在高速运动，根据相对论，乙的时间过得较慢，所以当乙回来时甲就要老一些；但在乙看来甲同样在做高速运动，于是他就会得出与甲相矛盾的结论。。。实验证实甲是对的，那么乙错在哪呢？
注意，狭义相对论只在**惯性系**中才适用，而乙由于在旅行途中调过头，速度的方向改变过，他的参考系因此不是惯性系，相对论的时间变换公式在乙的参考系中不成立，只有在甲的参考系中得出的结论才是正确的。问题解决。
然而我如果非要以乙为参考系分析那该怎么办呢？虽然在整个过程中乙不是惯性系，但在离开和返回这两个过程中分别是惯性系，所以我们可以将乙分成这两个过程来分析。
<!-- more -->
为了使问题简化，我们设乙来去时做的都是速度为v的匀速直线运动。
在乙离开的过程中甲相对于乙也是在做高速运动，因此在这段时间内乙看来甲的时间流逝地比自己慢。这好像又有些矛盾：在甲看来乙的时间也是比自己慢的，那么他们的时间快慢关系到底是怎样的呢？注意相对论中所有东西都是相对的，不同的参考系得出不同的结论很正常，所以这个看似违反常理的结论其实并不矛盾。
{% asset_img twin-paradox1.png 乙的参考系和甲的世界线 %}
同样，在乙返回时也是甲的时间比自己的慢。问题的关键就在乙转向的那一刻。我们需要把乙转向前后一瞬间甲在乙看来的时刻找出来。这需要用到洛伦兹变换的公式：
$$\tau={t-{v \over c^2}x \over \sqrt{1-{v^2 \over c^2}}}$$
其中$\tau$就是我们要的甲的固有时。现在问题来了，式中的速度在转向前后分别是v和-v，于是这里就有一个第一类间断点，设$t\_{0}$为转向的时刻，那么就有
$$\tau(t\_{0}-0)={t\_{0}-{v \over c^2}x \over \sqrt{1-{v^2 \over c^2}}}$$
$$\tau(t\_{0}+0)={t\_{0}+{v \over c^2}x \over \sqrt{1-{v^2 \over c^2}}}$$
这也就意味着，**在转向的一瞬间乙看来甲突然变老了**！而突变的时间为
$$\Delta\tau={2{v \over c^2}x \over \sqrt{1-{v^2 \over c^2}}}$$
把这段时间加上，就得到和甲一样的结果了。具体大家有兴趣可以自己算一下。
虽然问题完美解决，但我们也许会问：为什么甲的时间会突变？其实，这涉及到了广义相对论，在乙转向的那一刻，乙的参考系中由于转向的加速度而产生了一个方向向左（在图中）引力场，根据广义相对论，引力势能越大时间就流逝的越快。在我们的理想假设下这个引力场无限大，持续时间无线短，这就造成了甲时间突变的结果。虽然这个悖论渗透了广义相对论，但其实只有在考虑一般情形，即乙做的是非匀速运动时，才劳驾广义相对论。看，这样一个简单的悖论都涉及到了如此多的相对论原理，可见相对论真的是一个很有意思的理论！
好了，看完与时间收缩效应有关的悖论，我们再来看一个与尺缩效应有关的：
## 洛伦兹冰缝悖论
我也忘了这个悖论到底是不是和洛伦兹有关了，不过这不重要，重要的是这个悖论是这样的：
有一次物理学家洛伦兹在北极冰面上以接近光速的速度开快车，突然接到在冰面上静止的人打来的电话，说前面冰面上有一个长度和他车子一样的冰缝。洛伦兹一听并不慌张，他觉得在他看来冰面在高速运动，由于尺缩效应冰缝会缩短，因此自己不会掉下去。可过了一会儿他又想到地面上的人看来是他的车子缩短了，肯定会掉下去！于是他急忙刹车，这才没掉下去。问题是，如果他不刹车，他到底会不会掉下去？
这个问题其实和[堵火车悖论](http://www.physixfan.com/archives/68)是一个道理。分析车子落水时的那个平抛运动是很复杂的，因此我们简化一下模型：把冰缝用一层钢化玻璃补上，如果有某个时刻车子的前后轮都在玻璃上，我们就可以断言它一定落水。因此我们的分析中落水的条件就是车子的前后轮都在玻璃上。
这就涉及到同时的相对性了。我们说的“前后轮都在玻璃上”其实是指在地面上的人看来前后轮都在玻璃上，而在洛伦兹看来这个条件就会发生变化，前后轮在玻璃上的时间就会错开，成了前轮先离开玻璃后轮再接触玻璃。
{% asset_img lorentz-paradox.png 洛伦兹的世界线与同时线 %}
图中黄色的那一段就是“前后轮都在玻璃上”的时间。通过洛伦兹的同时线我们可以发现在这段时间里面洛伦兹看到的后轮并没有在冰面上，也就是说这时后轮接触玻璃的这个事件还没有传播到处于车头的洛伦兹那里。所以车子落水的条件在洛伦兹的参考系里面就要做相应的修改，经过修改后的条件恰好就可以使洛伦兹的参考系也符合落水的条件了。因此问题解决。
我总感觉这个解释有点像是在用结论证明条件一样，但仔细想一下又是对的，毕竟本来就是要把条件先变换到洛伦兹的参考系里面，然后再做分析，只不过分析又和条件变换一样了。
***
感觉这些悖论都挺有意思的，只要我们理解清楚了相对论中最核心的东西：相对性，解决它们就很容易了。
在上面两个悖论的解释中我都画出了一种称为时空图的图表，它是研究相对论的一种强有力的武器，有了它就可以避免列一大堆公式，更加直观地看出各个物体的运动轨迹间的关系，甚至可以直接从图中得出结论。我将会在以后的一篇文章中专门讲一下这种方法。
大家是不是觉得这两个悖论比较简单，还想看更多的？哈，那下次我们再来讨论一个更有意思的——**潜水艇悖论**。
