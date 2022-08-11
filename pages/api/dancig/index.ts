import { IterativeAssignmentStrategy } from "../../../entities/assignment/strategy.iterative";

export default async (req, res) => {

    const iterativeAssignmentStrategy = new IterativeAssignmentStrategy(
        [{
            id: "123",
            name: "nir",
            joinedAt: new Date('2022-08-01'),
            rank: "",
            role: "default"
        },
        {
            id: "456",
            name: "alex",
            joinedAt: new Date('2022-08-01'),
            rank: "",
            role: "default"
        },
        {
            id: "789",
            name: "matan",
            joinedAt: new Date('2022-08-01'),
            rank: "",
            role: "default"
        }],
        [{
            capcacity: 1,
            date: new Date('2022-08-07'),
            index: 1,
            type: "default",
        }, {
            capcacity: 1,
            date: new Date('2022-08-08'),
            index: 2,
            type: "default",
        }, {
            capcacity: 1,
            date: new Date('2022-08-09'),
            index: 3,
            type: "default",
        }],
        [{
            userId: "123",
            dates: [new Date('2022-08-07')],
        }],
        [{
            userId: "123",
            "default": 0,
            "weekend": 0,
            "holiday": 0
        },
        {
            userId: "456",
            "default": 0,
            "weekend": 0,
            "holiday": 0
        },
        {
            userId: "789",
            "default": 0,
            "weekend": 0,
            "holiday": 0
        }]
    );

    res.status(200).json(await iterativeAssignmentStrategy.assign());
};