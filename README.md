# @bimeister/event-bus

## Contents

1. _@bimeister/event-bus_ – JavaScript (TypeScript) Event Bus implementation
2. _@bimeister/event-bus/rxjs_ – RxJS wrapper over native implementation
3. _@bimeister/event-bus/rxjs-operators_ – concomitant RxJS operators for better developer experience

## Main concepts

- Multiple instances of EventBus may be created
- Format of dispatched payload is not limited
- Relations between dispatched data are managed by EventBus

## Usage

### Creation

```typescript
import { EventBus } from '@bimeister/event-bus';

const nativeBus: EventBus = new EventBus(); // if you need 0 dependant implementation
```

---

```typescript
import { EventBus } from '@bimeister/event-bus/rxjs';

const reactiveBus: EventBus = new EventBus(); // for RxJS interoperability
```

### Data dispatching and listening

```typescript
import { EventBus } from '@bimeister/event-bus';

const nativeBus: EventBus = new EventBus();

nativeBus.listen(
  (eventPayload: unknown) => console.log(eventPayload) // writes "Native data!"
);
nativeBus.dispatch('Native data!');
```

---

```typescript
import { EventBus } from '@bimeister/event-bus/rxjs';
import { tap } from 'rxjs/operators';

const reactiveBus: EventBus = new EventBus();

reactiveBus.dispatch('Reactive data!').pipe(
  tap(
    (eventPayload: unknown) => console.log(eventPayload) // writes "Reactive data!"
  )
);

/** or this way */

reactiveBus.listen().pipe(
  tap(
    (eventPayload: unknown) => console.log(eventPayload) // writes "Another reactive data!"
  )
);
reactiveBus.dispatch('Another reactive data!');
```

### Events linking

In case you need making 2 payloads relative to each other, you may use build-in linking methods.

Firstly, imagine we have two dispatches that should be relative:

```typescript
eventBus.dispatch('How are you?');
eventBus.dispatch("I'm fine, thanks");
```

Let EventBus do all work:

```typescript
import { WrappedEvent, PayloadType, EventBus } from '@bimeister/event-bus';
// import { WrappedEvent, PayloadType, EventBus } from '@bimeister/event-bus/rxjs';

const request: WrappedEvent<string> = new WrappedEvent<string>('How are you?');
const response: WrappedEvent<string> = request.createChild<string>("I'm fine, thanks");

eventBus.dispatch(request, { payloadType: PayloadType.Wrapped });
eventBus.dispatch(response, { payloadType: PayloadType.Wrapped });
```

<details>
<summary>Let's find out what has happen.</summary>
<p>

Firstly, we have put out data into WrappedEvents. `WrappedEvent` is a special container, that provides all linking
functionality. Check out its methods to learn more.

Secondly, we have dispatched our data using some new settings: `{ payloadType: PayloadType.Wrapped }`. This setting
changes dispatch behavior, so only `WrappedEvent` data is recognized as payload. Without this setting, `WrappedEvent`
would be dispatched without any magic:

```typescript
import { WrappedEvent, PayloadType, EventBus } from '@bimeister/event-bus';

const bus: EventBus = new EventBus();

bus.listen((eventPayload: unknown) => console.log(eventPayload));

bus.dispatch('Native payload, native dispatch');
bus.dispatch(new WrappedEvent<string>('Wrapped payload, native dispatch'));
bus.dispatch(new WrappedEvent<string>('Wrapped payload, wrapped dispatch'), { payloadType: PayloadType.Wrapped });

/**
 * Console output is:
 *
 * 1. "Native payload, native dispatch"
 *    string
 *
 * 2. { payload: "Wrapped payload, native dispatch" }
 *    object, WrappedEvent instance
 *
 * 3. "Wrapped payload, wrapped dispatch"
 *    string
 */
```

Listener behavior may be switched too:

```typescript
bus.listen((eventPayload: unknown) => console.log(eventPayload), { payloadType: PayloadType.Wrapped });

bus.dispatch('Native payload, native dispatch');
bus.dispatch(new WrappedEvent<string>('Wrapped payload, native dispatch'));
bus.dispatch(new WrappedEvent<string>('Wrapped payload, wrapped dispatch'), { payloadType: PayloadType.Wrapped });

/**
 * Console output now is:
 *
 * 1. { payload: "Native payload, native dispatch" }
 *    object, WrappedEvent instance; payload is string
 *
 * 2. { payload: { payload: "Wrapped payload, native dispatch" } }
 *    object, WrappedEvent instance; payload is another WrappedEvent
 *
 * 3. { payload: "Wrapped payload, wrapped dispatch" }
 *    object, WrappedEvent instance; payload is string
 */
```

So, knowing that we may use the power of `WrappedEvent` to work with relations.

</p>
</details>

Now we can listen to responds that are relative only to specific events:

```typescript
const request: WrappedEvent<string> = new WrappedEvent<string>('How are you?');
const response: WrappedEvent<string> = request.createChild<string>("I'm fine, thanks");

eventBus.listen(
  (event: WrappedEvent<unknown>) => {
    if (event.isChildOf(request)) {
      console.log(event.payload); // "I'm fine, thanks"
    }
  },
  { payloadType: PayloadType.Wrapped }
);

eventBus.dispatch('Who is on duty today?');
eventBus.dispatch(request, { payloadType: PayloadType.Wrapped });
eventBus.dispatch('What is the capital of Great Britain?');
eventBus.dispatch(response, { payloadType: PayloadType.Wrapped });
eventBus.dispatch('London is the capital of Great Britain');
eventBus.dispatch('Mr. Anderson is');
```

RxJS wrapper is powered up with build-in operators for `WrappedEvent` interactions. Check them out!
