import { observable } from 'mobx';
import * as React from 'react';
import { observer } from 'mobx-react';
import { b_ } from '../lib/b_';
import { RouteParams } from 'turbo-router';
import { EditorProps } from './Editor';
import { parseSSR3 } from './Sub';
import { EditorModel } from '../models/Editor';
import { HTTP } from '../lib/HTTP';
import { AudioModel } from '../models/Audio';

// const enLines = ['It was lovely summer weather in the country, and the golden corn, the green oats, and the haystacks piled up in the meadows looked beautiful', ' The stork walking about on his long red legs chattered in the Egyptian language, which he had learnt from his mother', ' The corn-fields and meadows were surrounded by large forests, in the midst of which were deep pools', ' It was, indeed, delightful to walk about in the country', ' In a sunny spot stood a pleasant old farm-house close by a deep river, and from the house down to the water side grew great burdock leaves, so high, that under the tallest of them a little child could stand upright', ' The spot was as wild as the centre of a thick wood', ' In this snug retreat sat a duck on her nest', '\nShe was beginning to get tired of her task, for the little ones were a long time coming out of their shells, and she seldom had any visitors', ' The other ducks liked much better to swim about in the river than to climb the slippery banks, and sit under a burdock leaf, to have a gossip with her', '\nAt length one shell cracked, and then another, and from each egg came a living creature that lifted its head and cried,\n"Peep, peep', '"\n"Quack, quack," said the mother, and then they all quacked as well as they could, and looked about them on every side at the large green leaves', ' Their mother allowed them to look as much as they liked, because green is good for the eyes', '\n\n\n"How large the world is," said the young ducks, when they found how much more room they now had than while they were inside the egg-shell', '\n"Do you imagine this is the whole world', '" asked the mother; "Wait till you have seen the garden; it stretches far beyond that to the parson’s field, but I have never ventured to such a distance', ' Are you all out', '" she continued, rising, "No, I declare, the largest egg lies there still', ' I wonder how long this is to last, I am quite tired of it', '" And she seated herself again on the nest', '\n"Well, how are you getting on', '" asked an old duck, who paid her a visit', '\n"One egg is not hatched yet," said the duck, "it will not break', ' But just look at all the others, are they not the prettiest little ducklings you ever saw', ' They are the image of their father, who is so unkind, he never comes to see', '"\n"Let me see the egg that will not break," said the duck; "I have no doubt it is a turkey’s egg', ' I was persuaded to hatch some once, and after all my care and trouble with the young ones, they were afraid of the water', ' I quacked and clucked, but all to no purpose', ' I could not get them to venture in', ' Let me look at the egg', ' Yes, that is a turkey’s egg; take my advice, leave it where it is and teach the other children to swim', '"\n"I think I will sit on it a little while longer," said the duck; "as I have sat so long already, a few days will be nothing', '"\n"Please yourself," said the old duck, and she went away', ' At last the large egg broke, and a young one crept forth crying:\n"Peep, peep', '"\nIt was very large and ugly', ' The duck stared at it and exclaimed, "It is very large and not at all like the others', ' I wonder if it really is a turkey', ' We shall soon find it out, however when we go to the water', ' It must go in, if I have to push it myself', '"\n\n\nOn the next day the weather was delightful, and the sun shone brightly on the green burdock leaves, so the mother duck took her young brood down to the water, and jumped in with a splash', '\n"Quack, quack," cried she, and one after another the little ducklings jumped in', ' The water closed over their heads, but they came up again in an instant, and swam about quite prettily with their legs paddling under them as easily as possible, and the ugly duckling was also in the water swimming with them', '\n"Oh," said the mother, "that is not a turkey', ' How well he uses his legs, and how upright he holds himself', ' He is my own child, and he is not so very ugly after all if you look at him properly', ' Quack, quack', ' Come with me now, I will take you into grand society, and introduce you to the farmyard, but you must keep close to me or you may be trodden upon; and, above all, beware of the cat', '”\nWhen they reached the farmyard', ' There was a great disturbance, two families were fighting for an eel’s head, which, after all, was carried off by the cat', '\n"See, children, that is the way of the world," said the mother duck, whetting her beak, for she would have liked the eel’s head herself', '\n"Come, now, use your legs, and let me see how well you can behave', ' You must bow your heads prettily to that old duck yonder; she is the highest born of them all, and has Spanish blood, therefore, she is well off', ' Don’t you see she has a red flag tied to her leg, which is something very grand, and a great honor for a duck; it shows that every one is anxious not to lose her, as she can be recognized both by man and beast', ' Come, now, don’t turn your toes, a well-bred duckling spreads his feet wide apart, just like his father and mother, in this way', ' Now bend your neck, and say "Quack', '"\n\n\nThe ducklings did as they were bid, but the other duck stared, and said, "Look, here comes another brood, as if there were not enough of us already', ' And what a queer looking object one of them is', ' We don’t want him here', '" And then one flew out and bit him in the neck', '\n"Let him alone," said the mother; "He is not doing any harm', '"\n"Yes, but he is so big and ugly," said the spiteful duck “and therefore he must be turned out', '”\n"The others are very pretty children," said the old duck, with the rag on her leg, "all but that one; I wish his mother could improve him a little', '"\n"That is impossible, your grace," replied the mother; "he is not pretty; but he has a very good disposition, and swims as well or even better than the others', ' I think he will grow up pretty, and perhaps be smaller; he has remained too long in the egg, and therefore his figure is not properly formed;"\nAnd then she stroked his neck and smoothed the feathers, saying, "It is a drake, and therefore not of so much consequence', ' I think he will grow up strong, and able to take care of himself', '"\n"The other ducklings are graceful enough," said the old duck', ' "Now make yourself at home, and if you can find an eel’s head, you can bring it to me', '"\nAnd so they made themselves comfortable; but the poor duckling, who had crept out of his shell last of all, and looked so ugly, was bitten and pushed and made fun of, not only by the ducks, but by all the poultry', '\n“He is too big', '” they all said, and the turkey cock, who had been born into the world with spurs, and fancied himself really an emperor, puffed himself out like a vessel in full sail, and flew at the duckling, and became quite red in the head with passion, so that the poor little thing did not know where to go, and was quite miserable because he was so ugly and laughed at by the whole farmyard', '\n\n\nSo it went on from day to day till it got worse and worse', ' The poor duckling was driven about by every one; even his brothers and sisters were unkind to him, and would say, "Ah, you ugly creature, I wish the cat would get you', '" And his mother said she wished he had never been born', ' The ducks pecked him, the chickens beat him, and the girl who fed the poultry kicked him with her feet', ' So at last he ran away, frightening the little birds in the hedge as he flew over the palings', '\n"They are afraid of me because I am ugly," he said', ' So he closed his eyes, and flew still farther, until he came out on a large moor, inhabited by wild ducks', ' Here he remained the whole night, feeling very tired and sorrowful', ' In the morning, when the wild ducks rose in the air, they stared at their new comrade', '\n"What sort of a duck are you', '" they all said, coming round him', '\nHe bowed to them, and was as polite as he could be, but he did not reply to their question', '\n"You are exceedingly ugly," said the wild ducks, "but that will not matter if you do not want to marry one of our family', '"\nPoor thing', ' He had no thoughts of marriage', ' All he wanted was permission to lie among the rushes, and drink some of the water on the moor', ' After he had been on the moor two days, there came two wild geese, or rather goslings, and were very saucy', '\n"Listen, friend," said one of them to the duckling, “you are so ugly, that we like you very well', ' Will you go with us, and become a bird of passage', ' Not far from here is another moor, in which there are some pretty wild geese, all unmarried', ' It is a chance for you to get a wife', '"'].map(line => line.trim().split(/ /));
// const ruLines = ['В деревне стояла прекрасная летняя погода, и золотая кукуруза, зелёный овёс и стога сена, сваленные на лугах, выглядели прекрасно', ' По зеленому лугу расхаживал длинноногий аист, болтая на египетском языке, которому он выучился у своей матери', ' Кукурузные поля и луга были окружены обширным лесом, в центре которого располагались глубокие озёра', ' Прогуливаться в деревне было воистину чудесно', '  Старая усадьба, освещённая солнцем, стояла рядом с глубокой речкой, а от от дома вниз к воде росли такие огромные листья лопуха, что под самыми высокими из них мог поместить маленький ребёнок в полный рост', ' В этом месте было так же дико, как в чаще глухого леса', ' Вот там-то и  сидела утка на своём гнезде', '\nОна начала уставать от своего занятия, малыши не торопились покидать свою скорлупу, и её редко навещали', ' Другим уткам больше нравилось плавать по речке, чем сидеть в лопухе да сплетничать вместе с нею', '\nНаконец треснула одна скорлупа, затем другая, и из каждого яйца стали появляться живые творения, чтобы поднять головы и закричать:\n"Пип-пип', '"\n"Кряк-кряк," сказала мама', ' Затем они накрякались вдоволь и стали смотреть вокруг во все стороны на огромные зелёные листья', ' Их мать позволяла им глазеть столько, сколько вздумается, потому что зелёный цвет полезен для глаз', '\n\n\n"Ах, как велик мир', '"  сказали утята, когда они увидели, как много места вокруг, чем когда они были внутри яичной скорлупы', ' "\n"Вы думаете, это весь мир', '" спросила утка', ' "Подождите, вы ещё не видели сад, он тянется далеко до пасторского сада, но я никогда не решалась на такие расстояния', ' Все вышли', '" продолжала она, поднимаясь, "Нет, я так и знала, большое яйцо всё ещё там', ' Интересно, сколько ещё это продлится, я так устала', '" И она снова уселась на яйца', '\n"Ну, как дела', '"  спросила старая утка, которая нанесла ей визит', '\n"Одно яйцо никак не вылупится," сказала утка', ' "Всё никак не лопается', ' Зато посмотри на тех других малюток, что уже вылупились, разве это не самые прекрасные утята, которых ты когда-либо видела', ' Они просто копия своего отца, который даже не пришёл на них взглянуть', '"\n"Покажи-ка мне то яйцо, которое не лопается,"  сказала утка', ' "Я не сомневаюсь, что оно индюшачье', ' Мне однажды довелось высиживать индюшачьи яйца', ' А сколько забот и трудностей было у меня потом с этими малышами, они очень боятся воды', ' Уж я и шипела, и крякала - всё напрасно', ' Так и не смогла заставить их рискнуть', '  Дай-ка я еще раз взгляну', ' Ну, так и есть', ' Индюшечье', ' Брось-ка его да ступай учи своих деток плавать', '\n"Нет, я, пожалуй, посижу," сказала  утка', '  "Сижу уже так долго, что несколько дней для меня - ничто', '"\n"Ну и сиди', ' - сказала старая утка и ушла', ' Наконец большое яйцо треснуло, и малютка вывалился и запищал:\n"Пип', ' Пип', '"\nНо какой же он был большой и уродливый', ' Утка оглядела его и воскликнула: "Ужасный урод', '"  сказала она', '  "И совсем не похож на других', ' Уж не индюшонок ли это в самом деле', ' Ну, да в воде-то он у меня побывает, хоть бы мне пришлось столкнуть его туда силой', '"\n\n\nНа другой день погода стояла чудесная, зеленый лопух был залит солнцем', ' Утка-мать со всей своей семьей отправилась к канаве', ' Бултых', ' - и она очутилась в воде', '\n"Кряк-кряк', '" крикнула она, и утята один за другим тоже прыгнули в воду', ' Сначала вода покрыла их с головой, но они сейчас же вынырнули и отлично поплыли вперед', ' Лапки у них так и заработали, так и заработали', ' Даже гадкий гадкий утёнок плавал со всеми', '\n"Ох', '" сказала утка', ' "Это не индюшонок', '" Как славно гребет лапками', ' И как прямо держится', ' Это мой собственный ребёнок', ' Да он вовсе не так дурен, если хорошенько присмотреться к нему', ' Кряк-кряк', ' Следуйте за мной и я введу вас в общество - мы отправимся на птичий двор', ' Только держитесь ко мне поближе, чтобы кто-нибудь не наступил на вас, и, кроме того, берегитесь кошек', '"\nСкоро они добралась до птичьего двора', ' Какая там была суматоха', ' Два утиных семейства дрались из-за головки угря', ' И в конце концов эта головка досталась кошке', '\n"Смотрите, детки, вот так всегда и бывает в жизни', '"  сказала утка-мать и облизнула язычком клюв - она и сама была не прочь отведать угриной головки', '\n"Ну, ну, шевелите лапками', ' И покажите мне, насколько хорошо вы умеете себя вести', ' Вы должны поклониться вон той старой утке', ' Она здесь знатнее всех', ' Она испанской породы и потому такая жирная', ' Видите, у нее на лапке красный лоскуток', '  Это высшее отличие, какого только может удостоиться утка', ' Это значит, что ее не хотят потерять, - по этому лоскутку ее сразу узнают и люди и животные', ' Ну, живо', ' Да не выворачивайте пальцы, воспитанный утенок должен держать лапы широко, как его отец и мать', ' Теперь наклоните головки и скажите: \'Кряк', '\'"\n\n\nУтята так и сделали', ' Но другие утки оглядели их и громко заговорили:  "Ну вот, еще целая орава', ' Точно без них нас мало было', ' А один-то какой странный', ' Такой нам здесь не нужен', '" И сейчас же одна утка подлетела и клюнула его в шею', '\n"Оставьте его в покое', '"  сказала утка-мать', '  "Ведь он вам ничего не сделал', '"\n"Да, но какой-то он большой и уродливый," прошипела злая утка', ' "Поэтому не мешает его немного проучить', '\nА старая утка с красным лоскутком на лапке сказала: "Славные у тебя детки', ' Все, кроме одного', '', '', '  Хорошо бы его немного подправить', '"\n"Это никак невозможно, ваша милость,"  ответила утка-мать', ' - Он некрасив - это правда, но у него доброе сердце', ' А плавает он не хуже, смею даже сказать - лучше других', ' Я думаю, со временем он выровняется и станет поменьше', ' Он слишком долго пролежал в яйце и потому немного перерос', '"\nИ она разгладила клювом перышки на его спине, говоря: "Кроме того, он селезень, а селезню красота не так уж нужна', ' Я думаю, он вырастет сильным и сможет позаботиться о себе', '"\n"Остальные утята очень, очень милы," - сказала старая утка', '  "Ну, будьте как дома, а если найдете угриную головку, можете принести ее мне', '"\nИ вот утята стали вести себя как дома, только бедному утенку, который вылупился позже других и был такой гадкий, никто не давал проходу', ' Его клевали, толкали и дразнили не только утки, но и все остальные птицы', '\n"Слишком велик', '"  говорили они', ' А индийский петух, который родился со шпорами на ногах и потому воображал себя чуть не императором, надулся и, словно корабль на всех парусах, подлетел прямо к утенку, поглядел на него и сердито залопотал, гребешок у него так и налился кровью', ' Бедный утенок просто не знал, что ему делать, куда деваться', ' И надо же было ему уродиться таким гадким, что весь птичий двор смеется над ним', '\n\n\nТак продолжалось изо дня в день, и становилось еще хуже', ' Все гнали бедного утенка, даже братья и сестры сердито говорили ему: “Хоть бы кошка утащила тебя, несносный урод', '” А мать говорила, что она хотела бы, чтобы он  никогда не родился', ' Утки щипали его, куры клевали, а девушка, которая давала птицам корм, отталкивала его ногою', ' Наконец утенок не выдержал', ' Он перебежал через двор и, распустив свои неуклюжие крылышки, кое-как перевалился через забор, напугав маленьких птичек', '\n"Это оттого, что я такой гадкий,"  подумал утенок и, зажмурив глаза, бросился бежать, сам не зная куда', ' Он бежал до тех пор', ' пока не очутился в болоте, где жили дикие утки', ' Тут он провел всю ночь', ' Бедный утенок устал, и ему было очень грустно', ' Утром дикие утки проснулись в своих гнездах и увидали нового товарища', '\n"Это что за птица', '  спросили они, окружив его', '\nУтенок  кланялся им, был вежлив, как мог, но на их вопрос  не ответил', '\n"Ну и гадкий же ты', '"  сказали дикие утки', '  "Впрочем, нам до этого нет никакого дела, лишь бы не захотел жениться на ком-нибудь из нашей семьи', '"\nБедняжка', ' Где уж ему было и думать о женитьбе', ' Лишь бы ему позволили жить в камышах да пить болотную воду', ' Так просидел он в болоте два дня', ' На третий день туда прилетели два диких гусака', ' Они  очень важничали', '\n"Слушай, дружище', '"  сказали они', '  "Ты такой гадкий, что вполне нам нравишься', ' Пойдём с нами, станешь перелётной птицей', ' Здесь поблизости есть еще болото, там живут премиленькие дикие гусыни-барышни,  все не замужем', '  У тебя есть шанс найти там жену', '"'];

// const enLines = enText.trim().split('\n').map(l => l.split(' '));
// const ruLines = ruText.trim().split('\n');

const enum Key {
    ENTER = 13,
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39,
    SPACE = 32,
    R = 82,
    E = 69,
    S = 83,

    V = 86,
    C = 67,
    X = 88,
    Z = 90,
}

export interface NextWordProps {
    model: EditorModel;
    audioUrl: string;
}

@b_
@observer
export class NextWord extends React.Component<NextWordProps, {}> {
    static onEnter({ urlParams, onEnd }: RouteParams): Promise<NextWordProps> {
        // const ytId = 'sRBaEM3ngCc';
        const ytId = '2h2f2Mdra4I';
        return new HTTP({ apiUrl: '/api' })
            .requestJSON('GET', '/video-data/' + ytId)
            .then((data: { status: string; captions: any[]; url?: string }) => {
                const ssrSubs = parseSSR3(data.captions[0].data);
                const subs = parseSSR3(data.captions[1].data);
                // return fetchTrascript(ytId).then(subs => {
                // console.log(subs);
                const model = new EditorModel(ytId, { lines: subs }, ssrSubs);
                return { model, audioUrl: data.url!, subs, ssrSubs };
                // });
            });
    }

    componentDidMount() {
        document.addEventListener('keypress', this.onKeyPress);
        document.addEventListener('keydown', this.onKeyPress);
        AudioModel.load(this.props.audioUrl).then(audioModel => {
            this.props.model.audioModel = audioModel;
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.onKeyPress);
        document.removeEventListener('keydown', this.onKeyPress);
    }

    @observable currentLine = 0;
    @observable openedWords = 0;

    onKeyPress = (e: KeyboardEvent) => {
        const { model } = this.props;
        const noMetaKey = !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey;
        if (noMetaKey) {
            let handled = true;
            switch (e.keyCode) {
                case Key.LEFT:
                    if (this.openedWords === 0) {
                        if (this.currentLine > 0) {
                            this.currentLine--;
                            this.openedWords = model.lines[this.currentLine].words.length;
                        }
                    } else {
                        this.openedWords--;
                    }
                    break;
                case Key.RIGHT:
                    if (this.openedWords === model.lines[this.currentLine].words.length) {
                        if (this.currentLine < model.lines.length - 1) {
                            this.currentLine++;
                            this.openedWords = 0;
                            const line = model.lines[this.currentLine];
                            if (model.audioModel) {
                                model.audioModel.play.play(line.start, line.end - line.start);
                            }
                        }
                    } else {
                        this.openedWords++;
                    }
                    window.scrollTo(0, 9999999);
                    break;
                case Key.ENTER:
                    break;
                default:
                    handled = false;
            }
            if (handled) {
                e.preventDefault();
            }
        }
    };

    render() {
        const { model } = this.props;
        return (
            <div className="__">
                {model.lines.slice(0, this.currentLine).map((line, i) =>
                    <div key={i} className="__line">
                        {/* <div className="__line-ru">
                            {ru}
                        </div> */}
                        <div className="__line-en">
                            {line.text}
                        </div>
                    </div>
                )}
                <div className="__current-line">
                    {/* <div className="__current-line-ru">
                        {model.lines[this.currentLine]}
                    </div> */}
                    <div className="__current-line-en">
                        {model.lines[this.currentLine].words.slice(0, this.openedWords).map(w => w.word).join(' ')}
                    </div>
                </div>
            </div>
        );
    }
}
