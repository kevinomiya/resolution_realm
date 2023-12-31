import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, Principal, float64, nat,} from 'azle';
import { v4 as uuidv4 } from 'uuid';

type Resolution = Record<{
    id: string;
    name: string;
    description: string;
    deadline: string;
    completed: boolean;
    category: string;
    progress: number;
    tags: Vec<string>;
    priority: string; //low, medium, high
    created_at: nat64;
    updated_at: Opt<nat64>;
}>;

const resolutionStr = new StableBTreeMap<string, Resolution>(0, 44, 512);

// resolution payload
type ResolutionPayload = {
    name: string;
    description: string;
    deadline: string;
    completed: boolean;
    category: string;
    progress: number;
    priority: string; //low, medium, high
};

// CRUD operations for resolution
$update
export function createResolution(payload: ResolutionPayload): Result<Resolution, string> {
  try {
    const newResolution = {
        id: uuidv4(),
        name: payload.name,
        description: payload.description,
        deadline: payload.deadline,
        completed: payload.completed,
        category: payload.category,
        progress: payload.progress,
        tags: [],
        priority: payload.priority,
        created_at: ic.time(),
        updated_at: Opt.None,
        };
        resolutionStr.insert(newResolution.id, newResolution);
        return Result.Ok<Resolution, string>(newResolution);
  } catch (error) {
    return Result.Err<Resolution, string>("Creating the Resolution has error");
  }
}


// update a Resolution 
$update
export function updateResolution(id: string, payload: ResolutionPayload): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            const updatedResolution: Resolution = { ...resolution, ...payload, updated_at: Opt.Some(ic.time()) };
            resolutionStr.insert(resolution.id, updatedResolution);
            return Result.Ok<Resolution, string>(updatedResolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}

// get a Resolution by id
$query
export function getResolution(id: string): Result<Resolution, string> {
   return match(resolutionStr.get(id), {
    Some: (resolution) => {
        return Result.Ok<Resolution, string>(resolution);
    },
    None: () => Result.Err<Resolution, string>(`Resolution with id:${id} has not been detected`),
});
}


// get all Resolutions
$query
export function getAllResolutions(): Result<Vec<Resolution>, string> {
  const resolutions = resolutionStr.values();
  return Result.Ok<Vec<Resolution>, string>(resolutions);
}


// delete a Resolution by id
$update
export function deleteResolution(id: string): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            resolutionStr.remove(id);
            return Result.Ok<Resolution, string>(resolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}

// insert tags to a Resolution
$update
export function insertTags(id: string, tags: Vec<string>): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            const updatedResolution: Resolution = { ...resolution, tags: tags };
            resolutionStr.insert(resolution.id, updatedResolution);
            return Result.Ok<Resolution, string>(updatedResolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}

// delete tags from a Resolution
$update
export function deleteTags(id: string, tags: Vec<string>): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            const updatedResolution: Resolution = { ...resolution, tags: tags };
            resolutionStr.insert(resolution.id, updatedResolution);
            return Result.Ok<Resolution, string>(updatedResolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}

// get all Resolutions by category
$query
export function getResolutionsByCategory(category: string): Result<Vec<Resolution>, string> {
    const resolutions = resolutionStr.values();
    const filteredResolutions = resolutions.filter((resolution) => resolution.category === category);
    return Result.Ok<Vec<Resolution>, string>(filteredResolutions);
}

// update progress of a Resolution
$update
export function updateProgress(id: string, progress: number): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            const updatedResolution: Resolution = { ...resolution, progress: progress };
            resolutionStr.insert(resolution.id, updatedResolution);
            return Result.Ok<Resolution, string>(updatedResolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}

// update priority of a Resolution
$update
export function updatePriority(id: string, priority: string): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            const updatedResolution: Resolution = { ...resolution, priority: priority };
            resolutionStr.insert(resolution.id, updatedResolution);
            return Result.Ok<Resolution, string>(updatedResolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}


// update completed of a Resolution
$update
export function updateCompleted(id: string, completed: boolean): Result<Resolution, string> {
    return match(resolutionStr.get(id), {
        Some: (resolution) => {
            const updatedResolution: Resolution = { ...resolution, completed: completed };
            resolutionStr.insert(resolution.id, updatedResolution);
            return Result.Ok<Resolution, string>(updatedResolution);
        },
        None: () => Result.Err<Resolution, string>(`Resolution with id:${id} not found`),
    });
}

// search for Resolutions by name or description or tags
$query
export function searchResolutions(query: string): Result<Vec<Resolution>, string> {
    const resolutions = resolutionStr.values();
    const filteredResolutions = resolutions.filter((resolution) => resolution.name.includes(query) || resolution.description.includes(query) || resolution.tags.includes(query));
    return Result.Ok<Vec<Resolution>, string>(filteredResolutions);
}



// UUID workaround
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
};




