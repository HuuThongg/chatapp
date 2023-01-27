interface LukeSkywalker {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}

export const fetchLukeSkywalker = async () => {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await fetch("https://swapi.dev/api/people/1").then((res) => {
    return res.json();
  });

  return data as LukeSkywalker;
};
export const fetchLukeSkywalkers = async (): Promise<LukeSkywalker> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dataa = await fetch("https://swapi.dev/api/people/1").then((res) => {
    return res.json();
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return dataa;
};
export const fetchLukeSkywalkera = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: LukeSkywalker = await fetch(
    "https://swapi.dev/api/people/1"
  ).then((res) => {
    return res.json();
  });

  return data;
};

interface Cacheaa {
  [id: string]: string;
}
  const cachec: Cacheaa = {};

 const cache: {
   [id: string]: string;
 } = {};
const cachse: Record<string, string> = {};

const add = (id: string, value: string) => {
  cache[id] = value;
};


const tryCatchDemo = (state: "fail" | "succeed") => {
  try {
    if (state === "fail") {
      throw new Error("Failure!");
    }
  } catch (e) {
    //   if (e instanceof Error) {
    //   return e.message;
    // }
    return (e as Error).message;
  }
};
//  the return result will have User and Post[] and {age:number}
// type DefaultUserAndPosts = (): User & { posts: Post[] } & { age: number}


export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

  export type IsAny<T> = 0 extends 1 & T ? true : false;
  export type NotAny<T> = true extends IsAny<T> ? false : true;

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

/**
 * How do we create a new object type with _only_ the
 * firstName and lastName properties of User?
 */

type MyType = Omit<User, "id">;

type tests = [Expect<Equal<MyType, { firstName: string; lastName: string }>>];

type MyType2 = Pick<User, "firstName" | "lastName">;


const createThenGetUser = async (
  createUser: () => Promise<string>,
  getUser: (id: string) => Promise<User>
): Promise<User> => {
  const userId: string = await createUser();

  const user = await getUser(userId);

  return user;
};






import { z } from "zod";

const StarWarsPerson = z.object({
  name: z.string(),
});

const StarWarsPeopleResults = z.object({
  results: z.array(StarWarsPerson),
});

const logStarWarsPeopleResults = (
  data: z.infer<typeof StarWarsPeopleResults>
) => {
  data.results.map((person) => {
    console.log(person.name);
  });
};
const a =z.object({ssaa:z.array(z.string()).default([])});



const Form = z.object({
  repoName: z.string(),
  keywords: z.array(z.string()).default([]),
});
type FormInput = z.input<typeof Form>
type FormInputInfer = z.infer<typeof Form>;

export const validateFormInput = (values: unknown) => {
  const parsedData = Form.parse(values);

  return parsedData;
};

const Formsa = z.object({
  repoName: z.string(),
  theme: z.union([z.literal("dark"), z.literal("light")]),
});
type inferred = z.infer<typeof Formsa>



const Id = z.string().uuid();

const Usera = z.object({
  id: Id,
  name: z.string(),
});

const Post = z.object({
  id: Id,
  title: z.string(),
  body: z.string(),
});

const Comment = z.object({
  id: Id,
  text: z.string(),
});
type posts = z.infer<typeof Post>;


const id = z.object({
  id: z.string().uuid(),
});
const Usera1 = id.extend({
  name: z.string(),
});

const Post1 = z.object({
  title: z.string(),
  body: z.string(),
});

const Comment1 = z.object({
  text: z.string(),
});
type Usera1 = z.infer<typeof Post>;





const StarWarsPersonx = z
  .object({
    name: z.string().transform((name) => `Awesome ${name}`),
  })
  .transform((person) => ({
    ...person,
    nameAsArray: person.name.split(" "),
  }));

const StarWarsPeopleResultss = z.object({
  results: z.array(StarWarsPersonx),
});

export const fetchStarWarsPeople = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await fetch(
    "https://www.totaltypescript.com/swapi/people.json"
  ).then((res) => res.json());

  const parsedData = StarWarsPeopleResultss.parse(data);

  return parsedData.results;
};


const myFunc = () => {
  return true;
};

type MyFuncReturn = ReturnType<typeof myFunc>;

const makeQuery = (
  url: string,
  opts?: {
    method?: string;
    headers?: {
      [key: string]: string;
    };
    body?: string;
  }
) => {};

type MakeQueryParameters = Parameters<typeof makeQuery>;

const getUser = () => {
  return Promise.resolve({
    id: "123",
    name: "John",
    email: "john@example.com",
  });
};

type ReturnValue = Awaited<ReturnType<typeof getUser>>;

const testingFrameworks = {
  vitest: {
    label: "Vitest",
  },
  jest: {
    label: "Jest",
  },
  mocha: {
    label: "Mocha",
  },
};

type TestingFramework = keyof typeof testingFrameworks;

type A =
  | {
      type: "a";
      a: string;
    }
  | {
      type: "b";
      b: string;
    }
  | {
      type: "c";
      c: string;
    };

export type Event =
  | {
      type: "click";
      event: MouseEvent;
    }
  | {
      type: "focus";
      event: FocusEvent;
    }
  | {
      type: "keydown";
      event: KeyboardEvent;
    };

type ClickEvent = Extract<Event, { type: "click" }>;

type NonKeyDownEvents = Exclude<Event, { type: "keydown" }>;

export const fakeDataDefaults = {
  String: "Default string",
  Int: 1,
  Float: 1.14,
  Boolean: true,
  ID: "id",
};

type FakeDataDefaults = typeof fakeDataDefaults;

export type StringType = FakeDataDefaults["String"];
export type IntType = FakeDataDefaults["Int"];
export type FloatType = FakeDataDefaults["Float"];
export type BooleanType = FakeDataDefaults["Boolean"];
export type IDType = FakeDataDefaults["ID"];

type EventType = Event["type"];

export const programModeEnumMap = {
  GROUP: "group",
  ANNOUNCEMENT: "announcement",
} as const;

export type GroupProgram = (typeof programModeEnumMap)["GROUP"];
export type AnnouncementProgram = (typeof programModeEnumMap)["ANNOUNCEMENT"];

const frontendToBackendEnumMap = {
  singleModule: "SINGLE_MODULE",
  multiModule: "MULTI_MODULE",
  sharedModule: "SHARED_MODULE",
} as const;

type BackendModuleEnum =
  (typeof frontendToBackendEnumMap)[keyof typeof frontendToBackendEnumMap];

const fruits = ["apple", "banana", "orange"] as const;

type AppleOrBanana = (typeof fruits)[0 | 1];
type Fruit = (typeof fruits)[number];

interface MyComplexInterface<Event, Context, Name, Point> {
  getEvent: () => Event;
  getContext: () => Context;
  getName: () => Name;
  getPoint: () => Point;
}

type Example = MyComplexInterface<
  "click",
  "window",
  "my-event",
  { x: 12; y: 14 }
>;

type GetPoint<T> = T extends MyComplexInterface<any, any, any, infer TPoint>
  ? TPoint
  : never;

//  generic type

// const returnWhatIPassIn = <T>(t: T) => {
//   return t;
// };

// const one = returnWhatIPassIn(1);

export const returnWhatIPassIn = <T extends string>(t: T) => t;

const ab = returnWhatIPassIn("a");
